/*************************************************************
* budgetControl
*/
let budgetControl = (function(){
    // Expense and Income function constructor
    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

// method of Expense //
// calcPercentage
Expense.prototype.calcPercentage = function(totalIncome){
    
    if(totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
    }else {
        this.percentage = -1;
    }
}

// getPercentage
Expense.prototype.getPercentage = function(){
    return this.percentage;
} 




// Memory for contain data
    let data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1

    }

// calculate totall
    let calculateTotall = function(type){
        let sum = 0;
        data.allItems[type].forEach(current =>{
            sum += current.value;
        });
        // add sum to totals
        data.totals[type] = sum;
    }



// expose to public
    return {
// addItem //
        addItem: function(type, des, val){
            let newItem, ID;

            // Create ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // push to data constructor
            data.allItems[type].push(newItem);
            return newItem;
        },


// deleteItem //
        deleteItem: function(type, id){
            let ids, index;

            // map method for create brandnew array
            ids = data.allItems[type].map(current =>{
                return current.id;
            })
            
            // find index
            index = ids.indexOf(id);
            
            // splice method for delete item the same id
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }

            

        },


// calculateBudget //
        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotall('inc');
            calculateTotall('exp');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0){
                // calculate the percentage of income that we spent
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                /* (exp 300 / inc 500) * 100 = 60% */

            }else{
                data.percentage = -1;
            }

        },


// getBudget //
        getBudget: function(){
            return{
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percentage: data.percentage

            }
        },

// showData //
        showData: function(){
            console.log(data);
            
        },

// calculatePercentage //
        calculatePercentage: function(){

            data.allItems['exp'].forEach( current =>{
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentage: function(){
            let allPercentage = data.allItems.exp.map( current => current.getPercentage());
            return allPercentage;            
        }


    }

})();



/*************************************************************
* budgetUI
*/
let budgetUI = (function(){

    // DOM string
    let DOMString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeElement: '.income__list',
        expenseElement: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: ('.item__percentage'),
        dateLabel: ('.budget__title--month')
    }

// formatNumber //
    let formatNumber = function(num, type){

        let numSplit, int, dec;

        // cover to ragular num -7.25 --> 7.25
        num = Math.abs(num);

        let number = new Intl.NumberFormat('en-CA', { style: 'decimal'}).format(num);


        /* // make decimal
        num = num.toFixed(2);
        
        // separate int and decimal
        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length - 3)+ "," +int.substr(int.length - 3, 3);
        }
        
        dec = numSplit[1]; */

        // return (type === 'exp' ? '-' : '+')+" "+int+"."+dec;
        return (type === 'exp' ? '-' : '+') +" "+ number;
        
    };


// nodeListForEach // 
    let nodeListForEach = function(list, cb){
        list.forEach((current, index) =>{
            cb(current, index);
        });
    }



// recived data //
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMString.inputType).value,
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat(document.querySelector(DOMString.inputValue).value)

            }
        },
// add list item //
        addListItem: function(obj, type){
            
            let html, newHTML, element;

            if(type === 'inc'){
                element = DOMString.incomeElement;
                html = `<div class="item clearfix" id="inc-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
            }else if(type === 'exp'){
                element = DOMString.expenseElement;
                html = `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
            }

            // Replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },
// clear fields //
        clearFieds: function(){
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMString.inputDescription +","+ DOMString.inputValue );
            
            // convert nodList to array
            fieldsArr = Array.prototype.slice.call(fields);
                       
            // clear fields
            fieldsArr.forEach((current, index, arr) =>{
                current.value = "";
            });
            // focus the first field
            fieldsArr[0].focus();


        },
// DOM //
        getDOMString: function(){
            return DOMString;
        },

// display budget //
        displayBudget: function(obj){
            // call formatNumber function
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMString.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMString.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMString.expenseLabel).textContent = formatNumber(obj.totalExpense, 'exp');

            if(obj.percentage > 0){
                document.querySelector(DOMString.percentageLabel).textContent = `${obj.percentage} %`;
                
            }else {
                document.querySelector(DOMString.percentageLabel).textContent = `---`;

            }
        },

// delete itemList //
        deleteItemList: function(itemID){
            let el = document.getElementById(itemID);
            el.parentNode.removeChild(el);            
        },

// display percentage //
        displayPercentage: function(persentage){
            let fields = document.querySelectorAll(DOMString.expensesPercLabel);
            
            nodeListForEach(fields, (current, index) =>{
                if(persentage[index] > 0){
                    current.textContent = persentage[index] + "%";
                }else{
                    current.textContent = "---";
                }
            });

        },

// display month //
        displayMonth: function(){
            let now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(DOMString.dateLabel).textContent = months[month] +" "+ year;
        },

// change type //
        changeType: function(){
            let fields = document.querySelectorAll(`${DOMString.inputType}, ${DOMString.inputDescription}, ${DOMString.inputValue}`);
            // change input box
            nodeListForEach(fields, current =>{
                current.classList.toggle('red-focus');
            })

            // chang btn
            document.querySelector(DOMString.inputBtn).classList.toggle('red');
        }


    }
       
})();



/*************************************************************
 * control
 */
let control = (function(budgetCtrl, UICtrl){
    
// setupEventListener
   let setupEventListener = function(){ 
        // DOMString
        let dom = UICtrl.getDOMString();
        
        // click button
        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);
        // press Enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
                // budgetCtrl.showData();
            }
        });
        // deleteBtn
        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);

        // changeType
        document.querySelector(dom.inputType).addEventListener('change', UICtrl.changeType);
    };


// updateBudget //
    let updateBudget = function(){
        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        let budget = budgetCtrl.getBudget();
        
        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);        

    }


// updatePercentage //
    let updatePercentage = function(){
        // 1. calculate percentage
        budgetCtrl.calculatePercentage();

        // 2. read percentage from budget control
        let percentage = budgetCtrl.getPercentage();

        // 3. update the UI with the new percentage
        UICtrl.displayPercentage(percentage);
    }
   
    
// ctrlAddItem //
    let ctrlAddItem = function(){
        
        // 1. get the field input data
        let input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){ //--> isNaN คือ ไม่ใช่ตัวเลข !isNaN ถ้าเป็นตัวเลขให้ return ture แต่ถ้าไม่ใช่ตัวเลข return false
            // 2. add item to budgetControl
            let newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    
            // 3. add item to UIControl
            UICtrl.addListItem(newItem, input.type);
    
            // 4. clear fields and focus
            UICtrl.clearFieds();

            // 5. calculate and update budget
            updateBudget();

            // 6. updatePercentage
            updatePercentage();
            
        }        
    }
    

// ctrlDeleteItem //
    let ctrlDeleteItem = function(e){
        let itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    
        if(itemID){
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. delete itemList from DOM
            UICtrl.deleteItemList(itemID);

            // 3. update item
            updateBudget();

        }
    }







    let objInit = {
        budget: 0,
        totalIncome: 0,
        totalExpense: 0,
        percentage: -1
    }
        
        return {
            init: function(){
                UICtrl.displayMonth();
                UICtrl.displayBudget(objInit);
                setupEventListener();
            }
        }
        
        
        
        
})(budgetControl, budgetUI);




control.init();
budgetUI.clearFieds();