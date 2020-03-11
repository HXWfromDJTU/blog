let {HashTable} =  require('./hashtable.js');


let table = new HashTable();

table.add('first',1);

table.add('second',456);
table.add('third',789);
table.add('forth',234);
table.add('fifth',098);

//console.log(table.get('first'));


table.delete('first');

for(let i of table){
    console.log(i);
}

