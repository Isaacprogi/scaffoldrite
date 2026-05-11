const letter = 'abcdcba'


const checkAnagram = (val) => {
    let left = 0;
    let right = val.length-1 
    while(left < right){
        if(val[left] !== val[right]){
            return false
        }
        left++
        right--
    }
    return true
}


const arr = [1, 2, 3, 4, 6]


const checkSum = (arr,target) => {
    let left = 0
    let right = arr.length -1;
    while(left < right){
        if(arr[left] + arr[right] > target){
            right --
        }else if(arr[left] + arr[right] < target){
            left ++
        }else{
            return [arr[right],arr[left]]
        } 
    }
}




const val = checkAnagram(letter)
console.log(val)

const vap = checkSum(arr,6)
console.log(vap)