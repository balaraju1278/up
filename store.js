const BASE_API = '/api/v1/corporate/configure/';

const TOKEN = null

function updateOnlineStatus()
    {
            
        document.getElementById("status").innerHTML = "";
        document.getElementById("app").style.visibility = "visible";
    }
    
    function updateOfflineStatus()
    {
         document.getElementById("status").innerHTML = "Machine dont have internt connection";
        document.getElementById("app").style.visibility = "hidden";
    }
    
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOfflineStatus);
    
    var STORAGE_KEY = 'pos-sale-cart'
    //var HOLD_ORDER_KEY = 'pos-hold-order'
    localStorage.clear();
    var cartProductsStorage = {
        fetch: function(){
            var scan_products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            scan_products.forEach(function(scan_product, index){
                scan_product.id = index            
            })
            cartProductsStorage.uid = scan_products.length
            return scan_products            
        },
        save: function(scan_products){
            localStorage.setItem(STORAGE_KEY, JSON.stringify(scan_products))
                    
        }
    }    
function sendBillerData(data){
         
        console.log("calling")
        console.log(data);
        console.log(JSON.stringify(data),)
        $.ajax({
            url: 'http://localhost:5000/api/v1/todos',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data),
            processData: false,
            success: function( data, textStatus, jQxhr ){
               alert('Congratulations '); 
            },
            error: function( jqXhr, textStatus, errorThrown ){
                alert('no'); 
            }
        })
          
                                                                                  
    }
    function sendCreditNoteData(data){
         
        console.log("calling")
        console.log(data);
        consoel.log(JSON.stringify(data))
        $.ajax({
            url: 'http://localhost:5000/api/v1/credit-note-issue',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data),
            processData: false,
            success: function( data, textStatus, jQxhr ){
               alert('Congratulations '); 
            },
            error: function( jqXhr, textStatus, errorThrown ){
                alert('no'); 
            }
        })
          
                                                                                  
    }
    
const store = new Vuex.Store({
	state: {
		status: '',
		token: localStorage.getItem('token') || '',
		endpoints: {
              obtainJWT: 'http://localhost:8000/auth/obtain_token/',
              refreshJWT: 'http://localhost:8000/auth/refresh_token/',
              productsApi: '',
            
        },
		user: {},
        user_id: '',
		sessionCustomer: {},
        scan_products: [],        
        posCart: {},
				
	},
	mutations: {
        add_log_user(state, user_id){
          console.log("adding user");
          state.user_id = user_id;
        },
        add_customer(state, sessionCustomer){
            console.log("adding_customer mutation");
            console.log(sessionCustomer);
          state.sessionCustomer=sessionCustomer;  
            console.log(state.sessionCustomer);
            console.log("last")
        },
        add_scan_products(state, scan_product) {
            state.scan_products.push(scan_product);
        },
        remove_scan_product(state, scan_product){
                console.log("from mutation rem")
                console.log(scan_product)
              state.scan_products.splice(state.scan_products.indexOf(scan_product), 1)
        },
		auth_request(state){	
			state.status = 'loading'	
		},
		auth_success(state, token, user){
			state.status='success'
			state.token = token		
			state.user=user
		},
		auth_error(state){
			state.status='error'		
		},
		logout(state){
			state.status=''
			state.token=''		
		},
		hold_item(state){
			
		},
		updateToken(state, newToken){
            localStorage.setItem('token', newToken);
            state.jwt = newToken;
        },
        removeToken(state){
            localStorage.removeItem('token');
            state.jwt = null;
        }
	},	
	actions: {
        addSessionCustomer({commit}, sessionCustomer){
            console.log("from start action");
          commit('add_customer', sessionCustomer);
            console.log(sessionCustomer);
            console.log("after action");
        },
        addScanProduct({commit}, scan_product){
            commit('add_scan_product', scan_product)
        },
        removeScanProduct({commit}, scan_product){
            console.log("from remove s")
            console.log(scan_product)
            commit('remove_scan_product', scan_product)  
        },
		login({commit}, user){
	        return new Promise((resolve, reject) => {
	            commit('auth_request')
	            axios({url: 'http://localhost:8000/api/v1/corporate/authenticate/', data: user, method: 'POST' , 'Access-Control-Allow-Origin': '*'})
	            .then(resp => {
                    console.log(resp.data);
                    commit('add_log_user', resp.data.id)                   
	                const token = resp.data.token
	                const user = resp.data.user
	                localStorage.setItem('token', token)
	                // Add the following line:
	                axios.defaults.headers.common['Authorization'] = token
									axios.defaults.xsrfCookieName = 'csrftoken'
									axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
	                commit('auth_success', token, user)
									console.log(user)
									console.log(token)
	                
                    resolve(resp)
                    
	            })
	            .catch(err => {
	                commit('auth_error')
	                localStorage.removeItem('token')
	                reject(err)
	            })
	        })
	    },
        
			HoldCart({commit}, holdItem){
				return new Promis((resolve, reject)=>{
					commit('hold_item')
					axios({url: 'http://localhost:8000/api/v1/corporate/auth/login/', data: HoldItem, method: 'POST' })
	            .then(resp => {
	                const token = resp.data.token
	                const user = resp.data.user
	                localStorage.setItem('token', token)
	                // Add the following line:
	                axios.defaults.headers.common['Authorization'] = token
									axios.defaults.xsrfCookieName = 'csrftoken'
									axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
	                commit('auth_success', token, user)
									console.log(user)
									console.log(token)
	                resolve(resp)
	            })
	            .catch(err => {
	                commit('auth_error')
	                localStorage.removeItem('token')
	                reject(err)
	            })		
				})
			},
			
			logout({commit}){
		    return new Promise((resolve, reject) => {
		      	commit('logout')
		      	localStorage.removeItem('token')
		      	delete axios.defaults.headers.common['Authorization']
		      	resolve()
		    })
	  	},
 obtainToken(username, password){
      const payload = {
        username: username,
        password: password
      }
      axios.post(this.state.endpoints.obtainJWT, payload)
        .then((response)=>{
            this.commit('updateToken', response.data.token);
          })
        .catch((error)=>{
            console.log(error);
          })
    },
    refreshToken(){
      const payload = {
        token: this.state.jwt
      }
      axios.post(this.state.endpoints.refreshJWT, payload)
        .then((response)=>{
            this.commit('updateToken', response.data.token)
          })
        .catch((error)=>{
            console.log(error)
          })
    },
    
	},
	getters: {
        sessionCustomer(state){
            return state.sessionCustomer;
        },
        get_log_user(state){
          return state.user_id;  
        },
        scan_products(state){
            return state.scan_products;
        },
		isLoggedIn: state => !!state.token,
	    authStatus: state => state.status,	
	}
})
Vue.prototype.$http = axios;
const token = localStorage.getItem('token')
if(token){
	Vue.prototype.$http.defaults.headers.common['Authorization']=token
}
const Home = {
    template: '#home',
    data() {
    return {
      visible: false,
    layout: "normal",
    input: null,
    options: {
      useKbEvents: false },
      defaults: {
        title: 'undefined title',
        body: 'undefined body',
        timeout: 5 },
      content: [],
      new_customer_toast:{title: 'title', body: 'PLEASE ADD THIS CUSTOMER', type: 'error', timeout: 5},
      customer_found_toast:{title: 'title', body: 'CUSTOMER FOUND', type: 'error', timeout: 5},    
      new_customer_created_toast: {title: 'title', body: 'CUSTOMER CREATED', type: 'error', timeout: 5},
      new_customer_creationerror_toast: {title: 'title', body: 'CUSTOMER CREATION ERROR', type: 'error', timeout: 5},
      number_error:{title: 'title', body: 'WRONG NUMBER', type: 'error', timeout: 5},    
      hold_order_toast: {title: 'title', body: 'CUSTOMER ORDER WAS HOLD', type: 'error', timeout: 5},
      save_order_toast: {title: 'title', body: 'CUSTOMER ORDER WAS REDEEMED', type: 'info', timeout: 5},
      cash_toast: {title: 'title', body: 'CUSTOMER PAID CASH', type: 'info', timeout: 5},
      card_toast: {title: 'title', body: 'CUSTOMER PAID WITH CARD', type: 'info', timeout: 5},
      credit_issue_toast: {title: 'title', body: 'ISSUED CREDIT NOTE', type: 'info', timeout: 5},
      loyalty_toast:{title: 'title', body: 'CUSTOMER USED LOYALTY POINTS', type: 'info', timeout: 5},
      voucher_toast:{title: 'title', body: 'CUSTOMER USED VOUCHER', type: 'info', timeout: 5},
      gift_card_toast:{title: 'title', body: 'CUSTOMER USED GIFT CARD', type: 'info', timeout: 5},
      cart_delete_toast:{title: 'title', body: 'CART WAS DELETED', type: 'info', timeout: 5},
      cart_item_delete_toast:{title: 'title', body: 'CART ITEM DELETED', type: 'info', timeout: 5},
      transaction_delete_toast:{title: 'title', body: 'MONEY TRANSACTION WAS DELETED', type: 'info', timeout: 5},
      redeem_credit_amount_toast:{title: 'title', body: 'PLEASE ENTER VALID AMOUNT', type: 'info', timeout: 5},
      redeem_credit_number_input_toast:{title: 'title', body: 'PLEASE ENTER VALID CREDIT NUMBER', type: 'info', timeout: 5},
      no_customer_toast: {title: 'title', body: 'FIRST TIME CUSTOMER', type: 'info', timeout: 5},
      a: { title: 'title', body: 'body', type: 'info', timeout: 5 } ,
      'keyBoard':{'one':'1', 'two':'2', 'three':'3', 'four':'4', 'five':'5', 'six':'6', 'seven':'7', 'eight':'8', 'nine':'9', 'zero':'0'}, 
      'scan_barcode': '',
      'number': '',
      'name':'',
      number_exits:0, 
      sessionCustomer:'',
      customerName: null,
      customers: [],
      credit_issues: ['FIT', 'DAMAGE', 'TORN'],
      sessionCustomerType: '',
      products: [],
            hold_cart: '',
            customer_purchase_history : '',
            sold_products: [],
            save_order_customer_number: '',
            customer_hold_order: '',            
            scan_products: cartProductsStorage.fetch(),
            newScanProduct: '',
            sessionCustomer: '',
            customerName: null,
            customers: [],
            store_employees: [],
            customer: [],
            customer_products: [],
            is_cart_empty: true,
            toPay: '',
            is_paid_extra: false,
            total_paid_amount: '',
            cash_input: '',
            card_input: '',
            credit_input: '',
            credit_number: '',
            loyalty_points_input: '',
            voucher_input: '',
            gift_card_input : '',
            credit_note_input:'',
            hold_mobile_number:'',
            first_letter: '',
            hold_items_list: [],
            is_customer: '',
            is_more_paid: true,
	        number_exits:0,
            employee_checked : 0,
            redeem_credit_number_input: '',
            redeem_credit_amount_input:'',
            amount_variable : 'AMOUNT GET',
            creditNoteData: {},
            newHoldItem:{'customer': null, 'hold_items':null , 'emp':''},
            newRetriveCart: {'customer':null, 'retrive_items': null, 'emp':''},
            newCustomer : {'mobile_number': null, name:null,'date_of_birth':null, 'distrcit':null, 'state':null, 'email':null },
            newCreditNote: {'customer':null, 'credit_invoice':null, 'credit_amount':null, 'issue':null,emp:this.$store.getters.get_log_user},
            newCreditRedeem: {'customer':null, 'credit_number': null, 'redeem_amount':null}, 
            creditNoteBoard:{'one':'1', 'two':'2', 'three':'3', 'four':'4', 'five':'5', 'six':'6', 'seven':'7', 'eight':'8', 'nine':'9', 'zero':'0'}, 
	        cashBoard:{'one':'1', 'two':'2', 'three':'3', 'four':'4', 'five':'5', 'six':'6', 'seven':'7', 'eight':'8', 'nine':'9', 'zero':'0'},
	        cardBoard:{'one':'1', 'two':'2', 'three':'3', 'four':'4', 'five':'5', 'six':'6', 'seven':'7', 'eight':'8', 'nine':'9', 'zero':'0'},
    	    saveBoard:{'one':'1', 'two':'2', 'three':'3', 'four':'4', 'five':'5', 'six':'6', 'seven':'7', 'eight':'8', 'nine':'9', 'zero':'0'}, 
            redeemBoard:{'one':'1', 'two':'2', 'three':'3', 'four':'4', 'five':'5', 'six':'6', 'seven':'7', 'eight':'8', 'nine':'9', 'zero':'0'},            
            newInvoice: {
                'customer': null,
                'subtotal_amount': null,
                'discount':0,
                'gst': null,
                'quantity': null,
                'total_paid': null,
                'total_change': null,
                'total_due': null,
                'total_bill': null,
                'payment_type': 'cash',
                'sold_by': null
            },            
            messages: {
                'cash_message': null,
                'card_message':null,
                'lp_message': null,
                'voucher_message': null,
                'cn_message': null,
                'gc_message': null,
                'ho_message': null,
                'di_message': null,
                'do_message':null,
                'ebill_message': null,
                'checkout_message':null,
            },
            cartItem: {'barcode': null, 
                    'description':null, 
                    'qty':null,
                    'descount':null,
                    'unit_price': null,
                    'amount':null
                    },     
            posCart : {
                    'customer':null, 
                    emp:this.$store.getters.get_log_user,
                    'name':null,
                    'subTotal': 0,
                    'discount':0,
                    'gst':0,
                    'quantity':0,
                    'totalPaid':0,
                    'totalChange': 0,
                    'totalDue':0,
                    'totalBill': 0,
                    'sold_by': '',
                    'credit_number': '',
                     payment: {
                        'cash':0, 
                        'card':0, 
                        'voucher':0, 
                        'gift_card':0, 
                        'points':0,
                        'credit_amount':0 
                    },
                     items:[]
              },    
     
    }
  },
  computed: {
    notes() {
      return this.$store.getters.notes;
    },
    customer_scan_products(){
        return this.$store.getters.scan_products;  
    },
    session_customer(){
        this.sessionCustomer = this.$store.getters.session_customer;
    }
    },
  created() {
    this.add({ title: 'title', body: 'nuberry toast notification display here', timeout: 1 });
    this.getCustomers();
    this.getProducts();
    //this.getCustomers();
    this.getStoreEmployees();
    //this.getSoldProducts();
    this.getHoldItems();   
  },
 mounted: function() {
        console.log("components mounting")
        //const  Printd  = window.print;
        //this.d = new Printd();
        this.getLAstInvoiceNumber();
        this.getLAstCreditNumber();
        this.getProducts();
        this.getCustomers();
        this.getStoreEmployees();
        //this.getSoldProducts();
        this.getHoldItems();     
      },
 watch:{
   scan_barcode: function(val){
        if(this.number.length ==0){
            alert("please enter mobile number");                
        }else{
            console.log(this.scan_products);
            this.scan_barcode = val;
            this.newScanProduct = this.getScanProduct(this.products, val);
            //this.newScanProduct = this.scanProduct();
            //console.log(this.newScanProduct);
            this.addItemToCart();
        }
                      
    },     
   number: function(val){               
                this.number = val;                
                if(val.length==10){
                    this.getCustomers();
                    this.sessionCustomer = this.getNewCustomer(this.customers, val);
                    this.posCustomer();
                    /*
                    console.log(this.sessionCustomer);
                    console.log(typeof this.sessionCustomer)
                    if(typeof this.sessionCustomer !== 'undefined'){
                        this.number_exits = 1;
                        this.sessionCustomerType = this.sessionCustomer.customer_type;
                        points_money = Number(this.sessionCustomer.total_points)/10
                        this.loyalty_points_input = points_money
                        console.log(this.sessionCustomer)
                        this.customerName = this.sessionCustomer.name;
                        this.first_letter = this.sessionCustomer.name[0]
                        //this.calculateCustomerLoyaltyMoney()
                       // this.customer_purchase_history = this.getSessionCustomerPurchases(this.sold_products, this.sessionCustomer.mobile_number);
                        //console.log(customer_purchase_history)
                        this.is_customer = true
                        this.$refs.barcode_input.focus()   
                    }else{
                         this.add(this.new_customer_toast);
                    }*/
                    	             
                }                                       
        },
 },
    components: {
        "vue-touch-keyboard": VueTouchKeyboard.component 
    },
   methods: {
    posCustomer: function(){
        if(typeof(this.sessionCustomer) === 'undefined'){
                console.log("hi")
                this.add(this.new_customer_toast)
        }else{
             this.number_exits = 1;
             this.add(this.customer_found_toast)
                        this.sessionCustomerType = this.sessionCustomer.customer_type;
                        points_money = Number(this.sessionCustomer.total_points)/10
                        this.loyalty_points_input = points_money
                        console.log(this.sessionCustomer)
                        this.customerName = this.sessionCustomer.name;
                        this.first_letter = this.sessionCustomer.name[0]
                        //this.calculateCustomerLoyaltyMoney()
                       // this.customer_purchase_history = this.getSessionCustomerPurchases(this.sold_products, this.sessionCustomer.mobile_number);
                        //console.log(customer_purchase_history)
                        this.is_customer = true
                        this.$refs.barcode_input.focus()   
        }
   },
     accept(text) {
      console.log("Input text: " + text);
      this.hide();
    },
    show(e) {
      this.input = e.target;
      this.layout = e.target.dataset.layout;
      if (!this.visible)
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    next() {
      let inputs = window.document.querySelectorAll("input");
      let found = false;
      [].forEach.call(inputs, (item, i) => {
        if (!found && item == this.input && i < inputs.length - 1) {
          found = true;
          this.$nextTick(() => {
            inputs[i + 1].focus();
          });
        }
      });
      if (!found) {
        this.input.blur();
        this.hide();
      }
    },
    createNewCustomer: function(){
            this.newCustomer.mobile_number = this.number;
            this.newCustomer.name = this.customerName;
            //this.newCustomer.gender = this.gender;
            this.loading = true;
            console.log("from creating")
            console.log(this.newCustomer)
            this.$http.post('http://localhost:8000/api/v1/corporate/create-customer/', this.newCustomer)
                .then((response)=>{
                    this.loading=true;
                    this.getCustomers();
                    this.sessionCustomer = this.newCustomer
                    this.sessionCustomer.customer_type = 'CLUB'
                    this.sessionCustomer.total_points = 0
                    this.add(this.new_customer_created_toast)
                    this.number_exits = 1
                    this.$refs.barcode_input.focus()   
                    this.newCustomer = '';                                                                      
                    }).catch((err)=>{
                        this.add(this.new_customer_creation_error_toast)
                        this.loading = true;                                                                          
                })    
    }, 
    getScanProduct: function(products, barcode_value){
            console.log("from get scan"+ barcode_value);
            for(var i=0, iLen=this.products.length;i<iLen;i++){
                if(this.products[i].barcode == barcode_value) return this.products[i];            
            }
    },
    getHoldItems:function(){
            let api_url = 'http://localhost:8000/api/v1/corporate/hold-items-list/';
            this.$http.get(api_url)
              .then((response) => {
                this.hold_items_list = response.data;
                console.log("ohold items")
                console.log(this.hold_items_list);
              })
              .catch((err) => {
                this.loading = false;
                console.log(err);
              }) 
        },
    getProducts:function(){
        let api_url = 'http://localhost:8000/api/v1/corporate/corporate-all-products/';
        this.$http.get(api_url)
            .then((response) => {
            this.products = response.data;
            console.log(this.products);
            //console.log(employeeData)
        })
        .catch((err) => {
            this.loading = false;
            console.log(err);
         }) 
    },
    getStoreEmployees: function(){
                    console.log("before calling emps")
                    console.log(localStorage.getItem('token'))
                    console.log(this.$store.getters.get_log_user);
                    let headers = {'Content-Type': 'application/json;charset=utf-8'};
                    headers['Authorization'] = localStorage.getItem('token')
                    this.$http.get('http://localhost:8000/api/v1/corporate/employee-list/', {headers})
                        .then((response)=>{
                            this.store_employees = response.data;
                            console.log(response.data);
                            let i = 0
                            let url = 'http://localhost:8000'
                            //for(i=0; i<=this.store_employees.length; i++ ){
                               // console.log(this.store_employees[i].photo)
                                //console.log(url+this.store_employees[i].photo)
                              //  this.store_employees[i].photo=url+this.store_employees[i].photo
                            //}
                            this.loading=false;                    
                        }).catch((err)=>{
                            this.loading=false;
                            console.log(err);                    
                        })            
    },
    addItemToCart: function(){
            console.log("from add item")
            console.log(this.newScanProduct);
            var item = this.newScanProduct
            if (!item){
                return            
            }
            this.scan_products.push({
                id: cartProductsStorage.uid++,
                product:item,            
            })
            this.calculateBill(item);
            //this.$store.dispatch('addScanProduct', item)
            //this.scan_products = this.$store.getters.scan_products;
            this.is_cart_empty = false;
            this.newScanProduct = ''
            this.scan_barcode = ''        
    },
    addnewHoldItem: function(){
            this.newHoldItem.customer=this.sessionCustomer.mobile_number;
            this.newHoldItem.hold_items = this.scan_products;
            this.newHoldItem.emp = this.$store.getters.get_log_user
            console.log(this.newHoldItem)		
            this.$http.post('http://localhost:8000/api/v1/corporate/add-hold-item/', this.newHoldItem)
                .then((response)=>{
                console.log("from hold");
                    this.newHoldItem.customer= null;
                this.newHoldItem.hold_items= null;
                    //this.getHoldItems();
                    this.deleteOrderFromCart();
                }).catch((err)=>{
                   this.loading = true;                
                })
				/*axios({url: 'http://localhost:8000/api/v1/corporate/add-hold-item/', data: this.newHoldItem, method: 'POST' })
	            .then(resp => {
	                
	                resolve(resp)
	            })
	            .catch(err => {
	                commit('auth_error')
	                //localStorage.removeItem('token')
	                reject(err)
	            })*/
    },
    calculateBill: function(item){
            this.posCart.subTotal = Number(this.posCart.subTotal)+Number(item.mrp_cost)
            if(Number(item.mrp_cost) >= 1000 ){
                    this.posCart.gst = Number(this.posCart.gst)+Number(10/100)*Number(item.mrp_cost)
            }else{
                    this.posCart.gst = Number(this.posCart.gst)+Number(5/100)*Number(item.mrp_cost)
            }
            this.posCart.quantity = this.scan_products.length;
            this.posCart.totalBill = Number(this.posCart.subTotal)//+Number(this.posCart.gst)
            this.toPay =  Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)  
            this.posCart.totalDue = Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
                  
        },
    addNew() {
        this.$store.dispatch('addNote', { text: 'hello' });
    }, 
    getCustomers: function(){
            let api_url = 'http://localhost:8000/api/v1/corporate/configure/customers/';
            this.$http.get(api_url)
                .then((response) => {
                    this.customers = response.data;
                    console.log(this.customers)
                }).catch((err)=>{
                    console.log(err);                
                })        
     },
    getNewCustomer: function(customers, customer_number){
            console.log("from get new customer"+ customer_number);
            console.log(customers)
            for(var i=0, iLen=this.customers.length;i<iLen;i++){
                if(this.customers[i].mobile_number == customer_number) 
                    {
                        console.log("found");
                        return this.customers[i]
                    }else{
                        //this.add(this.new_customer_toast)
                    }                     
            }
            
        },
       creditNoteBoardOne(){
          this.credit_note_input = this.credit_note_input+this.creditNoteBoard.one;
        },
        creditNoteBoardTwo(){
          this.credit_note_input =  this.credit_note_input+this.creditNoteBoard.two;
        },
        creditNoteBoardThree(){
          this.credit_note_input =  this.credit_note_input+this.creditNoteBoard.three;
        },
        creditNoteBoardFour(){
          this.credit_note_input =  this.credit_note_input+this.creditNoteBoard.four;
        },
        creditNoteBoardFive(){
          this.credit_note_input =  this.credit_note_input+this.creditNoteBoard.five;
        },
        creditNoteBoardSix(){
          this.credit_note_input =  this.credit_note_input+this.creditNoteBoard.six;
        },
        creditNoteBoardSeven(){
          this.credit_note_input =  this.credit_note_input+this.creditNoteBoard.seven;
        },
        creditNoteBoardEight(){
          this.credit_note_input =this.credit_note_input+this.creditNoteBoard.eight;
        },
        creditNoteBoardNine(){
          this.credit_note_input = this.credit_note_input+this.creditNoteBoard.nine;
        },
        creditNoteBoardZero(){
          this.credit_note_input = this.credit_note_input+this.creditNoteBoard.zero;
        },
       deleteCreditNoteIssue(){
          this.credit_note_input = ''
       },
       validateInvoiceNumber(){
         this.$refs.credit_issue.focus();  
       },
       getLAstInvoiceNumber:  function(){
            let api_url = 'http://localhost:8000/api/v1/corporate/get_last_invoice/';
            this.$http.get(api_url)
                .then((response) => {
                    this.last_invoice = response.data;               
                }).catch((err)=>{
                    console.log(err);                
            })              
        },  
       getLAstCreditNumber:  function(){
            let api_url = 'http://localhost:8000/api/v1/corporate/get_last_credit_number/';
            this.$http.get(api_url)
                .then((response) => {
                    this.last_credit_number = response.data;               
                }).catch((err)=>{
                    console.log(err);                
            })              
        },   
       addNewCreditNote: function(){
            this.newCreditNote.credit_invoice = this.credit_note_input;
            this.newCreditNote.customer=this.sessionCustomer.mobile_number;
            //console.log(this.newCreditNote);
            this.newCreditNote.credit_amount = this.posCart.totalBill;            
            this.creditNoteData.customer_name = this.sessionCustomer.name;
            this.creditNoteData.customer_number = this.sessionCustomer.mobile_number;
            this.creditNoteData.credit_value=this.posCart.totalBill;
            this.creditNoteData.credit_invoice =  this.credit_note_input;
            this.creditNoteData.credit_reason = this.newCreditNote.issue;
            console.log(this.last_credit_number);
            //last_cn =  this.last_credit_number.credit_number
            
           if(typeof(this.last_credit_number) === 'undefined'){
             this.creditNoteData.credit_number = 10000001
             this.$http.post('http://localhost:8000/api/v1/corporate/create-credit-note/', this.newCreditNote)                
                .then((response)=>{
                    this.loading = true;
                    sendCreditNoteData(this.creditNoteData) 
                    this.newCreditNote.customer = null;
                    this.newCreditNote.credit_invoice = null;
                    this.newCreditNote.credit_amount = null;
                    this.newCreditNote.issue =  null;
                    this.credit_note_input = '';
                    this.deleteOrderFromCart();
                    this.getLAstCreditNumber();
                                                       
                }).catch((err)=>{
                                  
                })  
            }else{
                
                 this.creditNoteData.credit_number = Number(this.last_credit_number)+1
                 this.$http.post('http://localhost:8000/api/v1/corporate/create-credit-note/', this.newCreditNote)                
                    .then((response)=>{
                        this.loading = true;
                        sendCreditNoteData(this.creditNoteData) 
                        this.newCreditNote.customer = null;
                        this.newCreditNote.credit_invoice = null;
                        this.newCreditNote.credit_amount = null;
                        this.newCreditNote.issue =  null;
                        this.credit_note_input = '';
                        this.deleteOrderFromCart();
                        this.getLAstCreditNumber();

                    }).catch((err)=>{

                    })  
            }            
        }, 
      keyBoardOne(){
            if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.one;
            }else{
                this.number = this.number+this.keyBoard.one;
            }
        },
        keyBoardTwo(){
         if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.two;
            }else{
                this.number = this.number+this.keyBoard.two;
            }
        },
        keyBoardThree(){
          if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.three;
            }else{
                this.number = this.number+this.keyBoard.three;
            }
        },
        keyBoardFour(){
          if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.four;
            }else{
                this.number = this.number+this.keyBoard.four;
            }
        },
        keyBoardFive(){
          if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.five;
            }else{
                this.number = this.number+this.keyBoard.five;
            }
        },
        keyBoardSix(){
          if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.six;
            }else{
                this.number = this.number+this.keyBoard.six;
            }
        },
        keyBoardSeven(){
         if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.seven;
            }else{
                this.number = this.number+this.keyBoard.seven;
            }
        },
        keyBoardEight(){
          if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.eight;
            }else{
                this.number = this.number+this.keyBoard.eight;
            }
        },
        keyBoardNine(){
          if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.nine;
            }else{
                this.number = this.number+this.keyBoard.nine;
            }
        },
        keyBoardZero(){
          if(this.number_exits == 1){
              this.scan_barcode = this.scan_barcode+this.keyBoard.zero;
            }else{
                this.number = this.number+this.keyBoard.zero;
            }
        },
        keyBoardCancel(){
          if(this.number_exits == 1){
              this.scan_barcode = ''
            }else{
                this.number_exits=''
            }
        },
        keyBoardRemove(){
          if(this.number_exits == 1){
               this.scan_barcode = this.scan_barcode.slice(0, -1);      
            }else{
                 this.number = this.number.slice(0, -1);
            }
         
        },
        cashBoardOne(){
          this.cash_input = this.cash_input+this.cashBoard.one;
        },
        cashBoardTwo(){
          this.cash_input =  this.cash_input+this.cashBoard.two;
        },
        cashBoardThree(){
          this.cash_input =  this.cash_input+this.cashBoard.three;
        },
        cashBoardFour(){
          this.cash_input =  this.cash_input+this.cashBoard.four;
        },
        cashBoardFive(){
          this.cash_input =  this.cash_input+this.cashBoard.five;
        },
        cashBoardSix(){
          this.cash_input =  this.cash_input+this.cashBoard.six;
        },
        cashBoardSeven(){
          this.cash_input =  this.cash_input+this.cashBoard.seven;
        },
        cashBoardEight(){
          this.cash_input =this.cash_input+this.cashBoard.eight;
        },
        cashBoardNine(){
          this.cash_input = this.cash_input+this.cashBoard.nine;
        },
        cashBoardZero(){
          this.cash_input = this.cash_input+this.cashBoard.zero;
        },
        cashBoardRemove(){
          this.cash_input = this.cash_input.slice(0, -1);
        },
       cashBoardOne(){
          this.cash_input = this.cash_input+this.cashBoard.one;
        },
        cashBoardTwo(){
          this.cash_input =  this.cash_input+this.cashBoard.two;
        },
        cashBoardThree(){
          this.cash_input =  this.cash_input+this.cashBoard.three;
        },
        cashBoardFour(){
          this.cash_input =  this.cash_input+this.cashBoard.four;
        },
        cashBoardFive(){
          this.cash_input =  this.cash_input+this.cashBoard.five;
        },
        cashBoardSix(){
          this.cash_input =  this.cash_input+this.cashBoard.six;
        },
        cashBoardSeven(){
          this.cash_input =  this.cash_input+this.cashBoard.seven;
        },
        cashBoardEight(){
          this.cash_input =this.cash_input+this.cashBoard.eight;
        },
        cashBoardNine(){
          this.cash_input = this.cash_input+this.cashBoard.nine;
        },
        cashBoardZero(){
          this.cash_input = this.cash_input+this.cashBoard.zero;
        },
	    cardBoardOne(){
          this.card_input = this.card_input+this.cardBoard.one;
        },
        cardBoardTwo(){
          this.card_input =  this.card_input+this.cardBoard.two;
        },
        cardBoardThree(){
          this.card_input =  this.card_input+this.cardBoard.three;
        },
        cardBoardFour(){
          this.card_input =  this.card_input+this.cardBoard.four;
        },
        cardBoardFive(){
          this.card_input =  this.card_input+this.cardBoard.five;
        },
        cardBoardSix(){
          this.card_input =  this.card_input+this.cardBoard.six;
        },
        cardBoardSeven(){
          this.card_input =  this.card_input+this.cardBoard.seven;
        },
        cardBoardEight(){
          this.card_input =this.card_input+this.cardBoard.eight;
        },
        cardBoardNine(){
          this.card_input = this.card_input+this.cardBoard.nine;
        },
        cardBoardZero(){
          this.card_input = this.card_input+this.cardBoard.zero;
        },
        redeemBoardOne(){
            if(this.credit_number_valid){
                this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.one;
            }else{
                this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.one;
            }
        },
        redeemBoardTwo(){
         if(this.credit_number_valid){
            this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.two;
            }else{
                this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.two;
            }
        },
        redeemBoardThree(){
          if(this.credit_number_valid){
               this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.three;
            }else{
               
                this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.three;
            }
        },
        redeemBoardFour(){
          if(this.credit_number_valid){
               this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.four;
            }else{               
                this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.four;
            }
        },
        redeemBoardFive(){
          if(this.credit_number_valid){
             this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.five;
            }else{
                this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.five;
            }
        },
        redeemBoardSix(){
          if(this.credit_number_valid){
              this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.six;
            }else{
                
                this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.six;
            }
        },
        redeemBoardSeven(){
         if(this.credit_number_valid){
              this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.seven;
            }else{
                
                this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.seven;
            }
        },
        redeemBoardEight(){
          if(this.credit_number_valid){
             this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.eight;
            }else{
                
                 this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.eight;
            }
        },
        redeemBoardNine(){
          if(this.credit_number_valid){
              this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.nine;
            }else{                
                this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.nine;
            }
        },
        redeemBoardZero(){
          if(this.credit_number_valid){
              this.redeem_credit_amount_input = this.redeem_credit_amount_input+this.redeemBoard.zero;
             
            }else{
                 this.redeem_credit_number_input = this.redeem_credit_number_input+this.redeemBoard.zero;
            }
        },
        redeemBoardCancel(){
          if(this.credit_number_valid){
              this.redeem_credit_number_input = ''
            }else{
                this.redeem_credit_amount_input_exits=''
            }
        },
        redeemBoardRemove(){
          if(this.credit_number_valid){
                   this.redeem_credit_amount_input = this.redeem_credit_amount_input.slice(0, -1);
            }else{
                 
                 this.redeem_credit_number_input = this.redeem_credit_number_input.slice(0, -1); 
            }
         
        },
        ValidatedCreditNumber(){
              let api_url = 'http://localhost:8000/api/v1/corporate/check-credit-number/';
              this.$http.post(api_url, {'redeem_credit_number_input': this.redeem_credit_number_input})
                .then((response)=>{
                    this.credit_number_valid =true;
                    
                    //this.add(this.)
                }).catch((err)=>{
                    this.add(this.redeem_credit_number_input_toast)
                    this.$refs.redeem_credit_otp.style.visibility="visible";
                    this.redeem_credit_number_input = '';
                    this.credit_number_valid=false;                    
                })                           
        },
        deleteItemFromCart: function(product){
            console.log("delete action",product)
            this.scan_products.splice(this.scan_products.indexOf(product), 1)
            this.posCart.quantity = this.scan_products.length;
            console.log(product.product.mrp_cost)
            this.posCart.subTotal = Number(this.posCart.subTotal)-Number(product.product.mrp_cost)
            if(Number(product.product.mrp_cost) >= 1000){
                this.posCart.gst = Number(this.posCart.gst)-Number(10/100)*Number(product.product.mrp_cost)
            }else{
                this.posCart.gst = Number(this.posCart.gst)-Number(5/100)*Number(product.product.mrp_cost)
            }
            this.posCart.totalDue = Number(this.posCart.subTotal)//+Number(this.posCart.gst)//Number(this.posCart.totalBill)-(Number(product.product.mrp_cost)+Number(5/100)*Number(product.product.mrp_cost))
            this.posCart.totalBill = Number(this.posCart.subTotal)//+Number(this.posCart.gst)//Number(this.posCart.totalBill)-(Number(product.product.mrp_cost)+Number(5/100)*Number(product.product.mrp_cost))
            this.toPay =  Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)        
        }, 
       deleteOrderFromCart: function(){
                                      //localStorage.clear(); 
                    this.scan_products = [];
                    this.posCart.subTotal = 0
                    this.posCart.gst = 0
                    this.posCart.quantity = 0
                    this.posCart.totalBill = 0  
                    this.posCart.totalPaid = 0
                    this.posCart.totalDue = 0
                    this.posCart.sold_by = ''
                    this.posCart.payment.cash = 0
                    this.posCart.payment.card = 0
                    this.posCart.payment.voucher = 0
                    this.posCart.payment.gift_card = 0
                    this.posCart.payment.points = 0
                    this.posCart.payment.credit_amount = 0
                    this.number = ''
                    this.customerName = ''
                    this.newCustomer = {'mobile_number': null, 'name':null,'date_of_birth':null, 'distrcit':null, 'state':null, 'email':null };
                    this.sessionCustomer = 'undefined'
                    this.loyalty_points_input = ''
                    this.number_exists = 0
                    this.toPay = 0
                    this.first_letter=''
                    this.is_customer = false;
                    this.is_more_paid = false;
                    this.employee_checked = 0;
                    this.gender = []
                    this.number_exits = 0
                    this.amount_variable = 'AMOUNT GET';
                    this.sessionCustomerType = '';
                    this.getLAstInvoiceNumber();
                   // this.getLAstCreditNumber();
                    this.add({ title: 'title', body: 'Cart Deleted', timeout: 3 });
    },
    getLAstInvoiceNumber:  function(){
            let api_url = 'http:localhost:8000/api/v1/corporate/get_last_invoice/';
            this.$http.get(api_url)
                .then((response) => {
                    this.last_invoice = response.data;               
                }).catch((err)=>{
                    console.log(err);                
            })              
        },  
         getLAstCreditNumber:  function(){
            let api_url = 'http:localhost:8000/api/v1/corporate/get_last_credit_number/';
            this.$http.get(api_url)
                .then((response) => {
                    this.last_credit_number = response.data;               
                }).catch((err)=>{
                    console.log(err);                
            })              
        },    
    deletePayment: function(){
            this.posCart.totalPaid = 0;
            this.toPay = Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
            this.posCart.totalDue = Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
            this.add({ title: 'title', body: 'Payment Deleted', timeout: 3 });
                    this.posCart.payment.cash = 0
                    this.posCart.payment.card = 0
                    this.posCart.payment.voucher = 0
                    this.posCart.payment.gift_card = 0
                    this.posCart.payment.points = 0
        },
        payCreditBill: function(){
            this.posCart.totalPaid = Number(this.posCart.totalPaid)+Number(this.redeem_credit_amount_input)
            this.posCart.totalDue = Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
            this.toPay =  Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
            this.posCart.payment.credit_amount = Number(this.posCart.payment.credit_amount)+Number(this.redeem_credit_amount_input)
            if(Number(this.posCart.totalPaid) > Number(this.posCart.totalBill)){
                this.amount_variable = 'AMOUNT PAY';        
            }
            console.log(this.credit_input);
            //this.newCreditRedeem.redeem_amount = this.credit_input;
            this.posCart.credit_number = this.redeem_credit_number_input;
            this.redeem_credit_number_input = null;
            this.redeem_credit_amount_input= '';
        },
        payCashBill: function(){
            this.posCart.totalPaid = Number(this.posCart.totalPaid)+Number(this.cash_input)
            this.posCart.totalDue = Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
            this.toPay =  Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
            this.posCart.payment.cash = Number(this.posCart.payment.cash)+Number(this.cash_input)
            if(Number(this.posCart.totalPaid) > Number(this.posCart.totalBill)){
                this.amount_variable = 'AMOUNT PAY';            
            }
            this.cash_input = '';
            this.add(this.cash_toast);
            
        },
        payCardBill: function(){
            this.posCart.totalPaid = Number(this.posCart.totalPaid)+Number(this.card_input)
            this.posCart.totalDue = Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
            this.toPay =  Number(this.posCart.totalBill)-Number(this.posCart.totalPaid)
            this.posCart.payment.card = Number(this.posCart.payment.card)+Number(this.card_input)
            if(Number(this.posCart.totalPaid) > Number(this.posCart.totalBill)){
                this.amount_variable = 'AMOUNT PAY';            
            }
            this.card_input = 0;
        },
        payVocherBill: function(){
            this.total_paid_amount = Number(this.total_paid_amount)+Number(this.voucher_input)
            this.voucher_input = 0;
            this.posCart.totalDue = Number(this.posCart.totalBill)-Number(this.total_paid_amount)
            if(Number(this.posCart.totalPaid) > Number(this.posCart.totalBill)){
                is_paid_extra = true;            
            }        
        },
        payGiftCardBill: function(){
            this.total_paid_amount = Number(this.total_paid_amount)+Number(this.gift_card_input)
            this.gift_card_input = 0;
            this.posCart.totalDue = Number(this.posCart.totalBill)-Number(this.total_paid_amount)
            if(Number(this.posCart.totalPaid) > Number(this.posCart.totalBill)){
                is_paid_extra = true;            
            }
        },
        payLoyaltyPointsBill: function(){
            this.total_paid_amount = Number(this.total_paid_amount)+Number(this.loyalty_points_input)
            this.loyalty_points_input = 0;
            this.posCart.totalDue = Number(this.posCart.totalBill)-Number(this.total_paid_amount)
            if(Number(this.posCart.totalPaid) > Number(this.posCart.totalBill)){
                is_paid_extra = true;            
            }
        },
        remainDue: function(){
            this.toPay = Number(this.posCart.totalBill) -Number(this.posCart.totalPaid) 
        },
        fetchCartFromHold: function(){
            console.log("from here")
						console.log()
            let customer_instance = this.sessionCustomer.mobile_number; 
            console.log(customer_instance)
            console.log(this.hold_items_list)
            for(var i=0, iLen=this.hold_items_list.length;i<iLen;i++){
                if(Number(customer_instance) == Number(this.hold_items_list[i].customer.mobile_number)){
                     this.newScanProduct = this.getScanProduct(this.products, this.hold_items_list[i].product.barcode);
                     console.log(this.newScanProduct);
                     this.addItemToCart();
                    //if(this.products[i].barcode == barcode_value) return this.products[i];   
                }else{
                    console.log("fromelse")                
                }
                        
            }
            this.retriveHoldItem();
        },
        retriveHoldItem: function(){
            this.newRetriveCart.retrive_items = this.scan_products;
            this.newRetriveCart.customer = this.sessionCustomer.mobile_number;
            this.newRetriveCart.emp = this.$store.getters.get_log_user
             this.$http.post('http:localhost:8000/api/v1/corporate/retrive-items-list/', this.newRetriveCart)                
                .then((response)=>{
                    this.loading = true; 
                    this.newRetriveCart.customer = '';
                    this.hold_mobile_number = '';
                    this.newRetriveCart.retrive_items= null;
                    //this.getHoldItems();                                   
                }).catch((err)=>{
                    console.log(err);                
                })     
        },
       customerCheckOut: function(number){                        
            this.posCart.customer = this.number;
            this.posCart.sold_by = number
            this.posCart.items = this.scan_products
            this.employee_checked = this.posCart.sold_by;
            console.log(this.posCart);
               
        },
        deleteEmplooye: function(number){
            this.posCart.sold_by = ''
        },
       deleteEmplooye: function(number){
            this.posCart.sold_by = ''
        },
        finalCheckOut: function(){
              this.$http.post('http:localhost:8000/api/v1/corporate/customer-check-out/', this.posCart)
                .then((response)=>{
                    console.log("print1")                    
                    this.loading=true;
                    customer_items = JSON.stringify(this.scan_products)
                    last_invoice =  this.last_invoice.invoice_number
                    //console.log(last_invoice)
                    //ar invoice_digit = last_invoice.split("SR-");
                    //console.log(invoice_digit)
                    //var temp = invoice_digit[1]
                    //console.log(temp)
                    //var temp_digit = Number(temp)+2
                    //console.log(temp_digit)
                    //var new_inv_number = inv+temp_digit
                    //console.log(new_inv_number)                    
                    this.posCart.invoice_number =  Number(last_invoice)+1
                    console.log(this.posCart.invoice_number)
                    this.posCart.items = customer_items
                    console.log(this.posCart);
                    sendBillerData(this.posCart)
                    this.deleteOrderFromCart();
                    this.getCustomers();
                    this.getProducts();
                    getStoreEmployees();
                    
                    }).catch((err)=>{
                        this.loading = true;                                                                          
                }) 
        },
    add(params) {
      for (let key in this.defaults) {
        if (params[key] === undefined) {
          params[key] = this.defaults[key];
        }
      }
      params.created = Date.now();
      params.id = Math.random();
      params.expire = setTimeout(() => {this.remove(params.id);}, params.timeout * 1000);
      this.content.unshift(params);
    },
    remove(id) {
      this.content.splice(this.index(id), 1);
    },
    index(id) {
      for (let key in this.content) {
        if (id === this.content[key].id) {
          return key;
        }
      }
    },
    type(type) {
      switch (type) {
        case 'error':
          return 'is-danger';
        case 'success':
          return 'is-success';
        case 'info':
          return 'is-info';}
    } },
}

const Login = {
    template: '#login',
		data:function(){
			return {
					username: '',
					password: '',
                    user_name: false,
                    username_input: '',
                    password_input: '',
                    content: [],
                    username_toast: {title: 'title', body: 'PLEASE ENTER VALID USERNAME', type: 'error', timeout: 5},
                    password_toast: {title: 'title', body: 'INVALID PASSWORD', type: 'error', timeout: 5},
				  LoginBoard:{'one':'1', 'two':'2', 'three':'3', 'four':'4', 'five':'5', 'six':'6', 'seven':'7', 'eight':'8', 'nine':'9', 'zero':'0'},			
				}		
		},
		
		methods: {
			login: function(){
				let username = this.username_input
				let password = this.password_input
				this.$store.dispatch('login', {username, password})
				.then(()=>this.$router.push('/home'))
				.catch((err)=>{
                   this.add(this.password_toast)
                   this.username_input = '';
                   this.password_input = '';
                   this.user_name=false;
                })//catch(err => this.add(this.password_toast))
			},
            LoginBoardOne(){
					if(this.user_name){
						this.password_input = this.password_input+this.LoginBoard.one;					
					}else{
	                   this.username_input = this.username_input+this.LoginBoard.one;
					}	  
	       },
            LoginBoardTwo(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.two;					
                        }else{
                  this.username_input = this.username_input+this.LoginBoard.two;
                        }	  
            },
            LoginBoardThree(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.three;					
                        }else{
                  this.username_input = this.username_input+this.LoginBoard.three;
                        }	  
            },
            LoginBoardFour(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.four;					
                        }else{
                  this.username_input = this.username_input+this.LoginBoard.four;
                        }	  
            },
            LoginBoardFive(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.five;					
                        }else{
                  this.username_input = this.username_input+this.LoginBoard.five;
                        }	  
            },
            LoginBoardSix(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.six;					
                        }else{
                  this.username_input = this.username_input+this.LoginBoard.six;
                        }	  
            },
            LoginBoardSeven(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.seven;					
                        }else{
                  this.username_input = this.username_input+this.LoginBoard.seven;
                        }	  
            },
            LoginBoardEight(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.eight;					
                        }else{
                  this.username_input = this.username_input+this.LoginBoard.eight;
                        }	  
            },
            LoginBoardNine(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.nine;					
                        }else{
                  this.username_input = this.username_input+this.LoginBoard.nine;
                        }	  
            },
            LoginBoardZero(){
              if(this.user_name){
                            this.password_input = this.password_input+this.LoginBoard.zero;					
                }else{
                  this.username_input = this.username_input+this.LoginBoard.zero;
                }	  
            },
            LoginBoardClear(){
              if(this.user_name){
                            this.password_input = '';	
                            this.user_name = false;
                             this.$refs.userName.style.color= "black";
                }else{
                  this.username_input = '';
                     this.$refs.userName.style.color= "black";    
                        }	  
            },
            LoginBoardPassword(){
              let api_url = 'http://localhost:8000/api/v1/corporate/check-user-name/';
              this.$http.post(api_url, {'user_name': this.username_input})
                .then((response)=>{
                    this.user_name =true;
                    this.$refs.userName.style.color= "darkgreen";
                }).catch((err)=>{
                    this.add(this.username_toast)
                    this.username_input = '';
                    this.user_name=false;
                     this.$refs.userName.style.color= "black";
                })                           
            },
            add(params) {
              for (let key in this.defaults) {
                if (params[key] === undefined) {
                  params[key] = this.defaults[key];
                }
              }
              params.created = Date.now();
              params.id = Math.random();
              params.expire = setTimeout(() => {this.remove(params.id);}, params.timeout * 1000);
              this.content.unshift(params);
            },
            remove(id) {
              this.content.splice(this.index(id), 1);
            },
            index(id) {
              for (let key in this.content) {
                if (id === this.content[key].id) {
                  return key;
                }
              }
            },
            type(type) {
              switch (type) {
                case 'error':
                  return 'is-danger';
                case 'success':
                  return 'is-success';
                case 'info':
                  return 'is-info';}
            }
		},			
};

const InvardProducts = {
    temaplte : '#InvardProducts',
    delimiters: ['${','}'],
    data:function(){
        return{
            transfer_products: [],
            search_trans_item: '',
        }
    },
    computed:{
        filteredList(){
				return this.transfer_products.filter(product =>{
						return product.product.article_number.toLowerCase().includes(this.search_trans_item.toLowerCase());				
				})			
        }		
    },
    mounted:function(){
        this.getTransferProducts();
    },
    methods:{
        getTransferProducts(){
                let api = BASE_API+'ws-tranfer-product-details/';
                this.$http.get(api)
                    .then((response)=>{
                        this.transfer_products =response.data;
                        console.log(this.transfer_products)
                    }).catch((err)=>{
                        console.log(err);  
                    })  
        },
    },
};

const StoreProducts = {
    template: '#StoreProducts',
    delimiters: ['${','}'],
    data:function(){
        return{
            transfer_products: [],
            search_trans_item: '',
            invard_products: [],
            AProduct: {'product': null}
        }
    },
    computed:{
        filteredList(){
				return this.invard_products.filter(product =>{
						return product.product.article_number.toLowerCase().includes(this.search_trans_item.toLowerCase());				
				})			
        }		
    },
    mounted:function(){
        this.getTransferProducts();
        this.getPros();
    },
    methods:{
        getTransferProducts(){
                let api = BASE_API+'ws-tranfer-product-details/';
                this.$http.get(api)
                    .then((response)=>{
                        this.transfer_products =response.data;
                        console.log(this.transfer_products)
                    }).catch((err)=>{
                        console.log(err);  
                    })  
        },
        getPros(){
            let api = BASE_API+'get_store_product_transfer_request/';
            let t = localStorage.getItem('token')
            console.log(t)
            this.$http.get(api, {headers:{
                    'Authorization':t,
                    'Accept': 'application/json'                
                }})
                .then((response)=>{                    
                    console.log("hi")
                    this.invard_products = response.data
                    console.log(this.invard_products)
                }).catch((err)=>{
                    console.log("e")
                })
        },
        acceptProduct:function(product){
            this.AProduct.product = product
            console.log(this.AProduct)
            console.log(this.product)
            let t = localStorage.getItem('token')  
            console.log(t)          
            let api = BASE_API+'store-accpet-product/';
            this.$http.post(api, this.AProduct)
                        .then((response)=>{
                           console.log("OK")                                         
                        }).catch((err)=>{
                            this.loading = true;                                                   
                        })      
        },
    },
};


const routes = [
		{path: '/', component: Login},
            { path: '/home', 
                    component: Home, 
                    meta: { 
                requiresAuth: true
            },},
             { path: '/invard-products', 
                    component: InvardProducts, 
                    meta: { 
                requiresAuth: true
            },},
             { path: '/store-products', 
                    component: StoreProducts, 
                    meta: { 
                requiresAuth: true
            },},
         
]
const router = new VueRouter({
    routes
});
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/') 
  } else {
    next() 
  }
})
new Vue({
    router, store,
}).$mount('#app');
