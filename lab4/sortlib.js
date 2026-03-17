(function (global) {
  'use strict';

  const SortLib = {};

  function validateArray(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Очікується масив JavaScript.');
    }
  }

  function prepareArray(arr) {
    validateArray(arr);

    const definedValues = [];
    let undefinedCount = 0;
    let sparseHoles = 0;

    for (let i = 0; i < arr.length; i++) {
      if (!(i in arr)) {
        undefinedCount++;
        sparseHoles++;
        continue;
      }

      const value = arr[i];

      if (value === undefined) {
        undefinedCount++;
        continue;
      }

      if (typeof value !== 'number' || Number.isNaN(value)) {
        throw new TypeError('Усі визначені елементи масиву повинні бути числами.');
      }

      definedValues.push(value);
    }

    return {
      definedValues,
      undefinedCount,
      sparseHoles,
      originalLength: arr.length
    };
  }

  function buildResultArray(sortedDefined, undefinedCount) {
    const result = new Array(sortedDefined.length + undefinedCount);
    for (let i = 0; i < sortedDefined.length; i++) {
      result[i] = sortedDefined[i];
    }
    return result;
  }

  function formatStats(method, ascending, prepared, comparisons, movements, resultArray) {
    const stats = {
      method,
      order: ascending ? 'ASC' : 'DESC',
      comparisons,
      movements,
      originalLength: prepared.originalLength,
      definedElements: prepared.definedValues.length,
      undefinedElements: prepared.undefinedCount,
      sparseHoles: prepared.sparseHoles,
      result: resultArray
    };

    console.log('----------------------------------------');
    console.log(`Метод: ${stats.method}`);
    console.log(`Порядок: ${stats.order}`);
    console.log(`Порівнянь: ${stats.comparisons}`);
    console.log(`Обмінів / переміщень: ${stats.movements}`);

    if (prepared.undefinedCount > 0) {
      console.log(
        `Виявлено ${prepared.undefinedCount} undefined/порожніх позицій ` +
        `(дірки sparse-масиву: ${prepared.sparseHoles}). ` +
        'Під час сортування числова частина була впорядкована, ' +
        'а undefined-елементи перенесені в кінець результату.'
      );
    } else {
      console.log('Undefined-елементи відсутні.');
    }

    return stats;
  }

  function shouldSwap(left, right, ascending) {
    return ascending ? left > right : left < right;
  }

  function bubbleCore(values, ascending) {
    const a = values.slice();
    let comparisons = 0;
    let movements = 0;

    for (let i = 0; i < a.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < a.length - 1 - i; j++) {
        comparisons++;
        if (shouldSwap(a[j], a[j + 1], ascending)) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          movements++;
          swapped = true;
        }
      }
      if (!swapped) {
        break;
      }
    }

    return { sorted: a, comparisons, movements };
  }

  function selectionCore(values, ascending) {
    const a = values.slice();
    let comparisons = 0;
    let movements = 0;

    for (let i = 0; i < a.length - 1; i++) {
      let targetIndex = i;
      for (let j = i + 1; j < a.length; j++) {
        comparisons++;
        const better = ascending ? a[j] < a[targetIndex] : a[j] > a[targetIndex];
        if (better) {
          targetIndex = j;
        }
      }
      if (targetIndex !== i) {
        [a[i], a[targetIndex]] = [a[targetIndex], a[i]];
        movements++;
      }
    }

    return { sorted: a, comparisons, movements };
  }

  function insertionCore(values, ascending) {
    const a = values.slice();
    let comparisons = 0;
    let movements = 0;

    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;

      while (j >= 0) {
        comparisons++;
        const mustMove = ascending ? a[j] > key : a[j] < key;
        if (!mustMove) {
          break;
        }
        a[j + 1] = a[j];
        movements++;
        j--;
      }

      a[j + 1] = key;
      movements++;
    }

    return { sorted: a, comparisons, movements };
  }

  function shellCore(values, ascending) {
    const a = values.slice();
    let comparisons = 0;
    let movements = 0;

    for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < a.length; i++) {
        const temp = a[i];
        let j = i;

        while (j >= gap) {
          comparisons++;
          const mustMove = ascending ? a[j - gap] > temp : a[j - gap] < temp;
          if (!mustMove) {
            break;
          }
          a[j] = a[j - gap];
          movements++;
          j -= gap;
        }

        a[j] = temp;
        movements++;
      }
    }

    return { sorted: a, comparisons, movements };
  }

  function quickCore(values, ascending) {
    const a = values.slice();
    let comparisons = 0;
    let movements = 0;

    function compareForLeft(value, pivot) {
      comparisons++;
      return ascending ? value < pivot : value > pivot;
    }

    function compareForRight(value, pivot) {
      comparisons++;
      return ascending ? value > pivot : value < pivot;
    }

    function hoarePartition(left, right) {
      const pivot = a[Math.floor((left + right) / 2)];
      let i = left - 1;
      let j = right + 1;

      while (true) {
        do {
          i++;
        } while (compareForLeft(a[i], pivot));

        do {
          j--;
        } while (compareForRight(a[j], pivot));

        if (i >= j) {
          return j;
        }

        [a[i], a[j]] = [a[j], a[i]];
        movements++;
      }
    }

    function quickSort(left, right) {
      if (left < right) {
        const p = hoarePartition(left, right);
        quickSort(left, p);
        quickSort(p + 1, right);
      }
    }

    if (a.length > 1) {
      quickSort(0, a.length - 1);
    }

    return { sorted: a, comparisons, movements };
  }

  function sortTemplate(methodName, coreSorter, arr, ascending = true) {
    const prepared = prepareArray(arr);
    const result = coreSorter(prepared.definedValues, ascending);
    const finalArray = buildResultArray(result.sorted, prepared.undefinedCount);
    return formatStats(methodName, ascending, prepared, result.comparisons, result.movements, finalArray);
  }

  SortLib.exchangeSort = function (arr, ascending = true) {
    return sortTemplate('Сортування обміну', bubbleCore, arr, ascending);
  };

  SortLib.selectionSort = function (arr, ascending = true) {
    return sortTemplate('Сортування мінімальних елементів', selectionCore, arr, ascending);
  };

  SortLib.insertionSort = function (arr, ascending = true) {
    return sortTemplate('Сортування вставками', insertionCore, arr, ascending);
  };

  SortLib.shellSort = function (arr, ascending = true) {
    return sortTemplate('Сортування Шелла', shellCore, arr, ascending);
  };

  SortLib.quickSort = function (arr, ascending = true) {
    return sortTemplate('Швидке сортування Хоара', quickCore, arr, ascending);
  };

  global.SortLib = SortLib;
})(typeof window !== 'undefined' ? window : globalThis);
