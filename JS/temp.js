function quickSort(arr, left, right) {
    if (left < right) {
        var i = left,
            j = right,
            x = arr[i];
        // 若两个标签未相遇
        while (i < j && arr[j] > x) {
            // 若 arr[j] 指向的值，比标准值大，则后标签向前移的动
            while (i < j && arr[j] > arr[i]) {
                j--;
            }
        }
        i++;
        // 这里用 i++，被换过来的值肯定比 arr[i]值小，赋值后直接让 i++
        if (i < j) {
            arr[i++] = arr[j];
        }
    }


}