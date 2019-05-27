const BASE_API = '/api/v1/corporate/configure/';


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
//if(token){
//	Vue.prototype.$http.defaults.headers.common['Authorization']=token
//}

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
const Home = {
    template: '#home',
    data: function(){
        return {}    
    }
}

const CorporateOrder = {
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

const StoreTransfers = {
    template: '#StoreTransfers',
    delimiters: ['${','}'],
    data:function(){
        return{
            transfer_products: [],
            search_trans_item: '',
            SendingProduct: {'product': null}
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
        SendToStore:function(product){
            this.SendingProduct.product = product
            console.log(this.SendingProduct)
            let api = BASE_API+'store-product-transfer-request/';
            this.$http.post(api, this.SendingProduct)
                        .then((response)=>{
                           console.log("OK")                                         
                        }).catch((err)=>{
                            this.loading = true;                                                   
                        })      
        },
    },
};



const routes = [
    {path: '/login', component: Login},
    { path: '', component: Home,meta: { 
            requiresAuth: true
        },
     },

    { path: '/corporate-orders', component: CorporateOrder },
    { path: '/store-transfers', component: StoreTransfers },
   
	
]

const router = new VueRouter({
    routes
});

new Vue({
    router
}).$mount('#app');
