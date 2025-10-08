const { formatHHMM, computeNextHHMM } = require('../src/lib/time');

// formatHHMM
describe('formatHHMM', () => {
    test('formate 10:03', () => {
        const date = new Date(2025, 0, 1, 10, 3);
        expect(formatHHMM(date)).toBe("10:03");
    });

    test('formate 00:00', () => {
        const date = new Date(2025, 0, 1, 0, 0);
        expect(formatHHMM(date)).toBe("00:00");
    });

    test('formate 23:59', () => {
        const date = new Date(2025, 0, 1, 23, 59);
        expect(formatHHMM(date)).toBe("23:59");
    });

    test('lance TypeError si argument est une chaîne', () => {
        expect(() => formatHHMM("not a date")).toThrow(TypeError);
    });

    test('lance TypeError si argument est null', () => {
        expect(() => formatHHMM(null)).toThrow(TypeError);
    });

    test('lance TypeError si argument est NaN', () => {
        expect(() => formatHHMM(new Date("invalid"))).toThrow(TypeError);
    });
});

// computeNextHHMM
describe('computeNextHHMM', () => {
    test('ajoute 3 minutes à 10:00', () => {
        const base = new Date(2025, 0, 1, 10, 0);
        expect(computeNextHHMM(base, 3)).toBe("10:03");
    });

    test("wrap d'heure (10:58 + 5min)", () => {
        const base = new Date(2025, 0, 1, 10, 58);
        expect(computeNextHHMM(base, 5)).toBe("11:03");
    });

    test('wrap de minuit (23:59 + 5min)', () => {
        const base = new Date(2025, 0, 1, 23, 59);
        expect(computeNextHHMM(base, 5)).toBe("00:04");
    });

    test('headwayMin = 0 => même heure', () => {
        const base = new Date(2025, 0, 1, 10, 0);
        expect(computeNextHHMM(base, 0)).toBe("10:00");
    });

    test('headwayMin négatif => RangeError', () => {
        const base = new Date(2025, 0, 1, 10, 0);
        expect(() => computeNextHHMM(base, -5)).toThrow(RangeError);
    });

    test('date invalide => TypeError', () => {
        expect(() => computeNextHHMM("bad", 3)).toThrow(TypeError);
    });

    test('baseDate null => TypeError', () => {
        expect(() => computeNextHHMM(null, 5)).toThrow(TypeError);
    });

    test('baseDate undefined => TypeError', () => {
        expect(() => computeNextHHMM(undefined, 5)).toThrow(TypeError);
    });

    test('ajoute 60 minutes (10:00 + 60min)', () => {
        const base = new Date(2025, 0, 1, 10, 0);
        expect(computeNextHHMM(base, 60)).toBe("11:00");
    });

    test('ajoute 120 minutes (10:00 + 120min)', () => {
        const base = new Date(2025, 0, 1, 10, 0);
        expect(computeNextHHMM(base, 120)).toBe("12:00");
    });

    test('headwayMin très grand (23:00 + 180min)', () => {
        const base = new Date(2025, 0, 1, 23, 0);
        expect(computeNextHHMM(base, 180)).toBe("02:00");
    });
    test('ignore les secondes dans le calcul', () => {
        const base = new Date(2025, 0, 1, 10, 0, 45);
        const result = computeNextHHMM(base, 5);
        expect(result).toBe("10:05");
    });
});
