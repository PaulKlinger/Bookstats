/**
 * Created by Paul on 2017-05-26.
 */

export function isNum(x) {
    if (x === undefined || x === null){return false;}
    return !!x.toFixed;
}

export function sum(a) {
    let total = 0;
    let contains_number = false;
    a.forEach(x => {
            if (isNum(x)) {
                contains_number = true;
                total += x;
            }
        }
    );
    return contains_number ? total : null;
}

export function mean(a) {
    let total = 0;
    let num = 0;
    a.forEach(x => {
            if (isNum(x)) {
                num++;
                total += x;
            }
        }
    );
    return num > 0 ? total/num : null;
}

export function countNum(a) {
    return a.filter(x => isNum(x)).length;
}

export function countEach(a) {
    let counts = {};
    a.forEach(x => {
        if (!counts.hasOwnProperty(x)) {
            counts[x] = 0
        }
        counts[x]++;
    });
    return counts;
}