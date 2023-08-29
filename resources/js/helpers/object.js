export function removeKeyFromObject(obj, keyToRemove) {
    const { [keyToRemove]: removed, ...rest } = obj;
    return rest;
}

export function moveKeyWithinObject(obj, keyToMove, indexToPositionAfter) {
    const itemToMove = obj[keyToMove];

    const keys = Object.keys(obj);
    if (!keys.includes(keyToMove)) {
        console.error(`Key ${keyToMove} tidak ditemukan dalam objek.`);
        return obj;
    }

    if (indexToPositionAfter < 0 || indexToPositionAfter >= keys.length) {
        console.error(`Index ${indexToPositionAfter} di luar batas.`);
        return obj;
    }

    const ordered = {};
    let inserted = false;
    for (let i = 0; i < keys.length; i++) {
        if (i === indexToPositionAfter + 1) {
            ordered[keyToMove] = itemToMove;
            inserted = true;
        }
        if (keys[i] !== keyToMove) {
            ordered[keys[i]] = obj[keys[i]];
        }
    }

    if (!inserted) {
        ordered[keyToMove] = itemToMove;
    }

    return ordered;
}
