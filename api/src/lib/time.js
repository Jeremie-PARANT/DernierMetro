function formatHHMM(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new TypeError("Invalid date");
    }
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
}

function computeNextHHMM(baseDate, headwayMin) {
    if (!(baseDate instanceof Date) || isNaN(baseDate)) {
        throw new TypeError("Invalid date");
    }
    if (typeof headwayMin !== "number" || headwayMin < 0) {
        throw new RangeError("Invalid headway");
    }
    const next = new Date(baseDate.getTime() + headwayMin * 60 * 1000);
    return formatHHMM(next);
}

module.exports = { formatHHMM, computeNextHHMM };