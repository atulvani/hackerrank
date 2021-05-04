// https://www.hackerrank.com/challenges/fraudulent-activity-notifications/problem

function calcMedian(sortedArr) {
    if (sortedArr.length % 2 === 0) { // even
        return (
            (
                sortedArr[sortedArr.length / 2]
                + sortedArr[(sortedArr.length / 2) - 1]
            ) / 2
        );
    } else { //odd
        return sortedArr[Math.floor(sortedArr.length / 2)];
    }
}

class MedianHelper {
    constructor(arr) {
        this.arr = arr;
        this.sortedArr = [...arr].sort((x, y) => x - y);
    }
    calcMedian() {
        return calcMedian(this.sortedArr);
    }
    push(newItem) {
        this.arr.push(newItem);
        const poppedItem = this.arr.shift();

        let removeIndex = this.sortedArr.indexOf(poppedItem);
        let insertIndex;
        if (newItem <= this.sortedArr[0]) {
            insertIndex = 0;
        } else if (newItem >= this.sortedArr[this.sortedArr.length - 1]) {
            insertIndex = this.sortedArr.length - 1;
        } else {
            for (let i = 0; i < this.sortedArr.length; i++) {
                if (this.sortedArr[i] <= newItem && newItem <= this.sortedArr[i + 1]) {
                    insertIndex = ((removeIndex >= i + 1) ? (i + 1) : i);
                }
            }
        }

        if (insertIndex < removeIndex) { // 0 ... i ... r ... end
            let prev, next = newItem;
            for (let i = insertIndex; i <= removeIndex; i++) {
                prev = this.sortedArr[i];
                this.sortedArr[i] = next;
                next = prev;
            }
        } else if (removeIndex < insertIndex) { // 0 ... r ... i ... end
            let prev, next = newItem;
            for (let i = insertIndex; i >= removeIndex; i--) {
                prev = this.sortedArr[i];
                this.sortedArr[i] = next;
                next = prev;
            }
        } else { // insertIndex === removeIndex
            this.sortedArr[removeIndex] = newItem;
        }
    }
}

function activityNotifications(expenditure, d) {
    if (d >= expenditure.length) {
        return 0;
    }

    let notificationCount = 0;
    let medianHelper = new MedianHelper(expenditure.slice(0, d));
    for (let i = d; i < expenditure.length; i++) {
        const current = expenditure[i];
        if (current >= 2 * medianHelper.calcMedian()) {
            notificationCount++;
        }
        medianHelper.push(current);
    }
    return notificationCount;
}

assert('sample1', activityNotifications([1, 2, 3, 4, 4], 4), 0);
assert('sample2', activityNotifications([2, 3, 4, 2, 3, 6, 8, 4, 5], 5), 2);

// for (let i = 0; i < 10; i++) { // ten random tests
//     let size = Math.round(Math.random() * 10) + 1;
//     let buffer = Math.round(Math.random() * size) + 1;
//     let arr = (new Array(size)).fill().map(_ => Math.round(Math.random() * 10));
//     let tries = Math.round(Math.random() * 10);
//     const medianHelper = new MedianHelper(arr);
//     for (let j = 0; j < tries; j++) {
//         assert(`round#${i + 1}, try#${j + 1}`, medianHelper.calcMedian(), calcMedian([...medianHelper.arr].sort((x, y) => x - y)));
//         const newItem = Math.round(Math.random() * 10);
//         medianHelper.push(newItem);
//     }
// }

function assert(desc, actual, expected) {
    if (actual !== expected) {
        console.error(desc, `: expected ${actual} to be ${expected}`);
    }
}
