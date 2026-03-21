const SortLib = {
  exchangeSort(arr, ascending = true) {
    const data = prepareArray(arr);
    const a = data.numbers.slice();
    let comparisons = 0;
    let moves = 0;

    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - 1 - i; j++) {
        comparisons++;
        if ((ascending && a[j] > a[j + 1]) || (!ascending && a[j] < a[j + 1])) {
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;
          moves++;
        }
      }
    }

    return makeResult("Сортування обміну", ascending, a, arr.length, data.undefinedCount, comparisons, moves);
  },

  selectionSort(arr, ascending = true) {
    const data = prepareArray(arr);
    const a = data.numbers.slice();
    let comparisons = 0;
    let moves = 0;

    for (let i = 0; i < a.length - 1; i++) {
      let best = i;

      for (let j = i + 1; j < a.length; j++) {
        comparisons++;
        if ((ascending && a[j] < a[best]) || (!ascending && a[j] > a[best])) {
          best = j;
        }
      }

      if (best !== i) {
        const temp = a[i];
        a[i] = a[best];
        a[best] = temp;
        moves++;
      }
    }

    return makeResult("Сортування мінімальних елементів", ascending, a, arr.length, data.undefinedCount, comparisons, moves);
  },

  insertionSort(arr, ascending = true) {
    const data = prepareArray(arr);
    const a = data.numbers.slice();
    let comparisons = 0;
    let moves = 0;

    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;

      while (j >= 0) {
        comparisons++;
        if ((ascending && a[j] > key) || (!ascending && a[j] < key)) {
          a[j + 1] = a[j];
          moves++;
          j--;
        } else {
          break;
        }
      }

      a[j + 1] = key;
      moves++;
    }

    return makeResult("Сортування вставками", ascending, a, arr.length, data.undefinedCount, comparisons, moves);
  },

  shellSort(arr, ascending = true) {
    const data = prepareArray(arr);
    const a = data.numbers.slice();
    let comparisons = 0;
    let moves = 0;

    for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < a.length; i++) {
        const temp = a[i];
        let j = i;

        while (j >= gap) {
          comparisons++;
          if ((ascending && a[j - gap] > temp) || (!ascending && a[j - gap] < temp)) {
            a[j] = a[j - gap];
            moves++;
            j -= gap;
          } else {
            break;
          }
        }

        a[j] = temp;
        moves++;
      }
    }

    return makeResult("Сортування Шелла", ascending, a, arr.length, data.undefinedCount, comparisons, moves);
  },

  quickSort(arr, ascending = true) {
    const data = prepareArray(arr);
    const a = data.numbers.slice();
    let comparisons = 0;
    let moves = 0;

    function quick(left, right) {
      let i = left;
      let j = right;
      const middle = a[Math.floor((left + right) / 2)];

      while (i <= j) {
        while (true) {
          comparisons++;
          if ((ascending && a[i] < middle) || (!ascending && a[i] > middle)) {
            i++;
          } else {
            break;
          }
        }

        while (true) {
          comparisons++;
          if ((ascending && a[j] > middle) || (!ascending && a[j] < middle)) {
            j--;
          } else {
            break;
          }
        }

        if (i <= j) {
          const temp = a[i];
          a[i] = a[j];
          a[j] = temp;
          if (i !== j) moves++;
          i++;
          j--;
        }
      }

      if (left < j) quick(left, j);
      if (i < right) quick(i, right);
    }

    if (a.length > 1) {
      quick(0, a.length - 1);
    }

    return makeResult("Сортування Хоара", ascending, a, arr.length, data.undefinedCount, comparisons, moves);
  }
};

function prepareArray(arr) {
  if (!Array.isArray(arr)) {
    throw new Error("Потрібно передати масив");
  }

  const numbers = [];
  let undefinedCount = 0;

  for (let i = 0; i < arr.length; i++) {
    if (!(i in arr) || arr[i] === undefined) {
      undefinedCount++;
    } else {
      if (typeof arr[i] !== "number" || Number.isNaN(arr[i])) {
        throw new Error("Масив повинен містити тільки числа або undefined");
      }
      numbers.push(arr[i]);
    }
  }

  return { numbers, undefinedCount };
}

function makeResult(method, ascending, sortedNumbers, fullLength, undefinedCount, comparisons, moves) {
  const result = sortedNumbers.slice();

  while (result.length < fullLength) {
    result.push(undefined);
  }

  return {
    method: method,
    direction: ascending ? "за зростанням" : "за спаданням",
    comparisons: comparisons,
    moves: moves,
    undefinedCount: undefinedCount,
    message: undefinedCount > 0
      ? "undefined або порожні елементи перенесено в кінець масиву"
      : "undefined елементів немає",
    result: result
  };
}

window.SortLib = SortLib;
