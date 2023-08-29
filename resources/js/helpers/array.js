window.obj_to_array = obj_to_array;
export function obj_to_array(obj) {
    const array = [];
    for (let key in obj) {
        array.push({
            key,
            ...obj[key],
        });
    }
    return array
}
