// https://www.hackerrank.com/challenges/challenging-palindromes/problem

function makePalindrom (str, mid) {
    let result = str + mid;
    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
}

function getLongestStr (arr) {
    return arr.reduce((acc, item) => {
        return item.length > acc.length ? item : (item.length === acc.length ? [item, acc].sort()[0] : acc);
    }, '');
}

function getPalindromsInString (str, shouldIndexFromEnd = false) {
    let result = {};
    const calcResultIndex = (i, j, isEvenLengthedPalindrom) => {
        if (shouldIndexFromEnd) {
            return isEvenLengthedPalindrom ? i + j - 1 : i + j;
        } else {
            return i - j;
        }
    };
    for (let i = 0; i < str.length; i++) {
        let j = 0;
        while(str[i - 1 - j] && str[i + j] && str[i - 1 - j] === str[i + j]) {
            j++;
            const k = calcResultIndex(i, j, true);
            if (!result[k] || result[k].length < j * 2) {
                result[k] = str.slice(i - j, i) + str.slice(i, i + j);
            }
        }
        j = 0;
        while (str[i - 1 - j] && str[i + j + 1] && str[i - 1 - j] === str[i + j + 1]) {
            j++;
            const k = calcResultIndex(i, j, false);
            if (!result[k] || result[k].length < ((j * 2) + 1)) {
                result[k] = str.slice(i - j, i) + str.slice(i, i + j + 1);
            }
        }
    }
    return result;
}

function makeFancyDataStructureFromString (str) {
    const ds = {};
    for (let i = str.length - 1; i >= 0; i--) {
        const char = str[i], prevChar = str[i + 1];
        ds[char] = ds[char] || { '@@': [] };
        ds[char]['@@'].push(i);
        if (prevChar) {
            ds[prevChar][char] = ds[prevChar][char] || {};
            ds[prevChar][char][i] = ds[char];
        }
    }
    return {
        hasAt: ((c) => ds[c] ? ds[c]['@@'] : []),
        is_X_At_N_FollowedBy_Y_: ((x, n , y) => !!ds[x][y] && !!ds[x][y][n]),
        get_X_FollowedBy_Y_: ((x, y) => Object.keys(ds[x][y] || {})),
    };
}

function buildPalindrome(a, b) {
    const fancyDs = makeFancyDataStructureFromString(b),
        palindromsInFirstString = getPalindromsInString(a, false),
        palindromsInSecondString = getPalindromsInString(b, true);

    let i = 0, result = '';
    while (i < a.length) {
        const char = a[i], charInSecondStrAt = fancyDs.hasAt(char);
        if (charInSecondStrAt.length !== 0) {
            if (i + 1 < a.length) {
                const nextChar = a[i + 1];

                result = getLongestStr([result, char + (palindromsInFirstString[i + 1] || nextChar) + char, ...(charInSecondStrAt.filter(i => i).map(i => char + (palindromsInSecondString[i - 1] || b[i - 1]) + char))]);

                const leads = fancyDs.get_X_FollowedBy_Y_(char, nextChar);
                for (let lead of leads) {
                    let j = 1, temp = char + nextChar;
                    while (i + j + 1 < a.length) {
                        if (fancyDs.is_X_At_N_FollowedBy_Y_(a[i + j], lead - j, a[i + j + 1])) {
                            temp += a[i + j + 1];
                            j++;
                        } else {
                            break;
                        }
                    }
                    const palindromFromFirstStr = makePalindrom(temp, palindromsInFirstString[i + j + 1] || a[i + j + 1] || ''),
                        palindromFromSecondStr = makePalindrom(temp, palindromsInSecondString[lead - j] || b[lead - j] || '');
                    let newResult;
                    if (palindromFromFirstStr.length > palindromFromSecondStr.length) {
                        newResult = palindromFromFirstStr;
                    } else if (palindromFromSecondStr.length > palindromFromFirstStr.length) {
                        newResult = palindromFromSecondStr;
                    } else {
                        newResult = [palindromFromFirstStr, palindromFromSecondStr].sort()[0];
                    }
                    if (result.length < newResult.length) {
                        result = newResult;
                    } else if (result.length === newResult.length) {
                        result = [result, newResult].sort()[0];
                    }
                }
            } else if (result.length <= 2 && charInSecondStrAt.length === 1 && charInSecondStrAt[0] === 0) {
                result = getLongestStr([result, char + char]);
            } else {
                result = getLongestStr([result, ...(charInSecondStrAt.filter(i => i).map(i => char + (palindromsInSecondString[i - 1] || b[i - 1]) + char))]);
            }
        }
        i++;
    }

    return result || -1;
}
