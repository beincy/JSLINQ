# JSLINQ
the linq for javascript like c#
Welcome to the JSLINQ wiki!
# Start
You can use it directly on the html 
```
 <script src="JSLINQ.js"></script>
```
or 
use import module
```
import JSLINQ.js
```

>and now you can use next api

## Array to iterator
Convert the array to an iterator
```
let arr=[1,2,3,4,5,6,6,7,8,9,0];
let enumerables=new JSLINQ(arr);
for(let a of enumerables){
console.log(a);
}
```

## toList
also you can Convert the iterator to an array
```
let arr=[1,2,3,4,5,6,6,7,8,9,0];
let enumerables=new JSLINQ(arr);
let list=enumerables.toList();
```

## Where 
Filter the target element;target Is a function that returns a Boolean value type;
```
let myList= enumerables.where(w=>w>5);
for(let a of myList){
console.log(a);
}
```

## Select 
projection transformation;
```
let myList= enumerables.Select(w=>{"name":w});
for(let a of myList){
console.log(a.name);
}
```

## Any
Tests for  one or more elements；
```
console.log(enumerables.any());
```

## Take
Gets the specified number of elements;
```
let myList= enumerables.take(1);
for(let a of myList){
console.log(a.name);
}
```

## Exist
Test whether the target exists;
```
console.log(enumerables.exist(w=>w>6));
```

## Contains
Test whether the target exists;
```
console.log(enumerables.contains(6));
```

## Remove
Remove a or more target element;
```
let myList= enumerables.remove(w=>w>5);
for(let a of myList){
console.log(a);
}
```

## RemoveAll
Remove all target element;
```
let myList= enumerables.removeAll(w=>w>5);
for(let a of myList){
console.log(a);
}
```
## orderBy
orderBy;
```
let myList= enumerables.orderBy(w=>w);
for(let a of myList){
console.log(a);
}
```
## orderByDesc
orderBy;
```
let myList= enumerables.orderByDesc(w=>w);
for(let a of myList){
console.log(a);
}
```
## groupBy
groupBy;
```
let myList= enumerables.groupBy(w=>w);
for(let a of myList){
console.log(a);
}
```
## distinct
distinct;
```
let myList= enumerables.distinct(w=>w);
for(let a of myList){
console.log(a);
}
```
