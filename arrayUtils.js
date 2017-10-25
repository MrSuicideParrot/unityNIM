// Array utils

function sumArray(arr){
    var aux = 0;
    for(i in arr){
        aux += arr[i];
    }
    return aux;
}

function indexOfMax(arr, par=false) {
    if (arr.length === 0) {
        return -1;
    }

    var not_zero;

    for (var i = 0; i < arr.length; i++) {
        if(arr[i]%2===0 && arr[i]!==0 || !par){
            var max = arr[i];
            var maxIndex = i;
            break;
        }
        else if (arr[i]!==0) {
            not_zero = i;
        }
    }
    if(max != null){
        for (; i < arr.length; i++) {
            if (arr[i] > max && (arr[i]%2===0 || !par)) {
                maxIndex = i;
                max = arr[i];
            }
        }
    }
    else{
        return not_zero;
    }

    return maxIndex;
}

function initialize_Array(number, target){
    var arr = Array();
    for (var i = 0; i < number; i++)
            arr[i] = target;
    return arr;
}

function division(number){
    return [number%2,Math.trunc(number/2)];
}

function toBin(arr){
    var max = arr.length;
    var num = 0;
    var ind = 0;
    for (var i = max-1; i >= 0; i--) {
        num += arr[ind]*Math.pow(2,i);
        ++ind;
    }
    return num;
}
