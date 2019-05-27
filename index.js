const BASE_API = '/api/v1/corporate/configure/';
var CTRANSFER_KEY = 'ctransfer_key'
var cartProductsStorage = {
        fetch: function(){
            var transfer_products = JSON.parse(localStorage.getItem(CTRANSFER_KEY) || '[]')
            transfer_products.forEach(function(tansfer_product, index){
                transfer_product.id = index            
            })
            cartProductsStorage.uid = transfer_products.length
            return transfer_products            
        },
        save: function(transfer_products){
            localStorage.setItem(CTRANSFER_KEY, JSON.stringify(transfer_products ))
                    
        }
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

const ConfigreData = {
    template: '#ConfigureData',
		data: function(){
				return{
                    defaults: {
                            title: 'undefined title',
                            body: 'undefined body',
                            timeout: 5 
                    },
                    content: [],
                    a: { title: 'title', body: 'body', type: 'info', timeout: 3 },
                    data_list: [
								'season', 
								'collection',
								'phase',
								'department',
								'brand',
								'category',
								'gender',
								'product group',
								'combo',
								'color',
								'weave',
								'major fabric',
								'fabric details',
								'fabric care',
								'rice',
								'stretch',
								'shade',
								'closure',
								'surface',
								'basetype',
								'occasion',
								'sleeve',
								'length',
								'hemline',
								'shape',
								'fit',
								'neck',
				            ],
                    search_data: '',
                    newSeason:'',
                    newShade:'',
                    newClosure:'',
                    newSurface:'',
                    newBaseType:'',
                    newOccasion:'',
                    newCollection:'',
                    newWeave:'',
                    newMajorFabric:'',
                    newFabricDetail:'',
                    newFabricCare:'',
                    newRice:'',
                    newStretch:'',
                    newPhase:'',
                    newDepartment:'',
                    newBrand:'',
                    newGender:'',
                    newCategory:'',
                    newGender:'',
                    newProductGroup:'',
                    newCombo:'',
                    newColor:'',
                    newSleeve: '',
                    newLength: '',
                    newHemline: '',
                    newShape: '',
                    newFit: '',
                    newNeck: '',
                    seasons:[],
                    shades:[],
                    clousers:[],
                    surfaces:[],
                    base_types:[],
                    occasions:[],
                    collections:[],
                    weaves:[],
                    major_fabrics:[],
                    fabric_details:[],
                    fabric_cares:[],
                    rices:[],
                    stretchs:[],
                    phases:[],
                    departments:[],
                    brands:[],
                    genders:[],
                    product_groups:[],
                    combos:[],
                    colors:[],
                    sleeves:[],
                    lengths:[],
                    hemlines:[],
                    fits:[],
                }	
		},
		computed:{
			filteredList(){
				return this.data_list.filter(data_item =>{
						return data_item.title.toLowerCase().includes(this.search_data.toLowerCase());				
					})			
			}		
		},
        mounted(){
            this.getSeasons();
            this.getShades();
            this.getClousers();
            this.getSurfaces();
            this.getBaseTypes();
            this.getOccasions();
            this.getCollections();
            this.getWeaves();
            this.getMajorFabrics();
            this.getFabricDetails();
            this.getFabricCares();
            this.getRices();
            this.getStretchs(); 
            this.getPhases();
            this.getDepartments();
            this.getBrands();
            this.getGenders();
            this.getCategories();
            this.getGenders();
            this.getProductGroups();
            this.getCombos();
            this.getColors();
            this.getSleeves();
            this.getLengths();
            this.getHemlines();
            this.getShapes();
            this.getFits();
            this.getNecks();

        },
        methods:{
            // data fetch functions      
            getSeasons(){
                let api = BASE_API+'seasons/';
                this.$http.get(api)
                    .then((response)=>{
                        this.seasons =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })
            },
            getShades(){
                let api = BASE_API+'shades/';
                this.$http.get(api)
                    .then((response)=>{
                        this.shades =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })
            },
            getClousers(){
                let api = BASE_API+'closures/';
                this.$http.get(api)
                    .then((response)=>{
                        this.closures =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getSurfaces(){
                let api = BASE_API+'surfaces/';
                this.$http.get(api)
                    .then((response)=>{
                        this.surface =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getBaseTypes(){
                let api = BASE_API+'basetypes';
                this.$http.get(api)
                    .then((response)=>{
                        this.base_types =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getOccasions(){
                let api = BASE_API+'occasions/';
                this.$http.get(api)
                    .then((response)=>{
                        this.occasions =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getCollections(){
                let api = BASE_API+'collections/';
                this.$http.get(api)
                    .then((response)=>{
                        this.collections =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getWeaves(){
                let api = BASE_API+'weaves/';
                this.$http.get(api)
                    .then((response)=>{
                        this.weaves =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                                
            },
            getMajorFabrics(){
                let api = BASE_API+'major-fabrics/';
                this.$http.get(api)
                    .then((response)=>{
                        this.fabrics =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getFabricDetails(){
                let api = BASE_API+'fabric-details/';
                this.$http.get(api)
                    .then((response)=>{
                        this.fabric_details =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getFabricCares(){
                let api = BASE_API+'fabric-cares/';
                this.$http.get(api)
                    .then((response)=>{
                        this.fabric_cares =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getRices(){
                let api = BASE_API+'rises/';
                this.$http.get(api)
                    .then((response)=>{
                        this.rices =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getStretchs(){
                let api = BASE_API+'stretchs/';
                this.$http.get(api)
                    .then((response)=>{
                        this.stretchs =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getPhases(){
                let api = BASE_API+'phases/';
                this.$http.get(api)
                    .then((response)=>{
                        this.phases =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getDepartments(){
                let api = BASE_API+'departments/';
                this.$http.get(api)
                    .then((response)=>{
                        this.departments =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getBrands(){
                let api = BASE_API+'brands/';
                this.$http.get(api)
                    .then((response)=>{
                        this.brands =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getGenders(){
                let api = BASE_API+'genders/';
                this.$http.get(api)
                    .then((response)=>{
                        this.genders =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getCategories(){
                let api = BASE_API+'categories/';
                this.$http.get(api)
                    .then((response)=>{
                        this.categories =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getProductGroups(){
                let api = BASE_API+'product-groups/';
                this.$http.get(api)
                    .then((response)=>{
                        this.product_groups =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })
            },
            getCombos(){
                let api = BASE_API+'combos/';
                this.$http.get(api)
                    .then((response)=>{
                        this.combos =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getColors(){
                let api = BASE_API+'colors/';
                this.$http.get(api)
                    .then((response)=>{
                        this.colors =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getSleeves(){
                let api = BASE_API+'sleeves/';
                this.$http.get(api)
                    .then((response)=>{
                        this.sleeves =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getLengths(){
                let api = BASE_API+'lengths/';
                this.$http.get(api)
                    .then((response)=>{
                        this.lengths =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getHemlines(){
                let api = BASE_API+'hemlines/';
                this.$http.get(api)
                    .then((response)=>{
                        this.hemlines =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getShapes(){
                let api = BASE_API+'shapes/';
                this.$http.get(api)
                    .then((response)=>{
                        this.shapes =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getFits(){
                let api = BASE_API+'fits/';
                this.$http.get(api)
                    .then((response)=>{
                        this.fits =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            getNecks(){
                let api = BASE_API+'necks/';
                this.$http.get(api)
                    .then((response)=>{
                        this.necks =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })                
            },
            
            // data creation functions
            addSeason(){},
            addShade(){},
            addClosure(){},
            addSurface(){},
            addBaseType(){},
            addOccasion(){},
            addCollection(){},
            addWeave(){},
            addMajorFabric(){},
            addFabricDetail(){},
            addFabricCare(){},
            addRice(){},
            addStretch(){},
            addPhase(){},
            addDepartment(){},
            addDepartment(){},
            addBrand(){},
            addGender(){},
            addCategory(){},
            addGender(){},
            addProductGroup(){},
            addCombo(){},
            addColor(){},
            addSleeve(){},
            addLength(){},
            addHemline(){},
            addShape(){},
            addFit(){},
            addNeck(){},
        },
};
const AddProduct = {
    delimiters: ['${','}'],
    template: '#AddProduct',
    data: function(){
        return{
                   loading :true,
                    seasons:[],
                    shades:[],
                    clousers:[],
                    surfaces:[],
                    base_types:[],
                    occasions:[],
                    collections:[],
                    weaves:[],
                    major_fabrics:[],
                    fabric_details:[],
                    fabric_cares:[],
                    rices:[],
                    stretchs:[],
                    phases:[],
                    departments:[],
                    brands:[],
                    genders:[],
                    product_groups:[],
                    combos:[],
                    colors:[],
                    sleeves:[],
                    lengths:[],
                    hemlines:[],
                    fits:[],
                    products: [],
                    search_item:'',
                    search_article:'',
                    search_barcode:'',
                    items:[],
                    sample:'',
                    editProduct: {'article_number':null, 'image':null}
        }
    },
    created(){
        
        
    },
    computed:{

        filterItems(){
            var 
            items = this.items,
            store=this.search_store; 
            items = items.filter(item =>{
                                return item.article_number.toLowerCase().includes(this.search_article.toLowerCase());				
				})
            items = items.filter(item =>{
                                return item.barcode.toLowerCase().includes(this.search_barcode.toLowerCase());				
				})

            return items;		
    },
    },
    mounted:function(){
        this.getProducts();        
    },
    methods:{
        getProducts(){
                let api = BASE_API+'products/';
                this.$http.get(api)
                    .then((response)=>{
                        this.items =response.data;
                        this.loading = false;
                    }).catch((err)=>{
                        console.log(err); 
                        this.loading = false; 
                    })         
            
        },
        editProductDetail:function(product){
            console.log("from here")
            this.editProduct.article_number = product.article_number;        
        },
        editIt(){
              const file_input = document.getElementById('imageProduct');
                console.log(file_input)
              const img = file_input.files[0]
                console.log(img)
             let formData = new FormData();
                formData.append('image', img);
                console.log(formData);      
        },       
    },
};
const ProductData = {
    delimiters: ['${','}'],
    template: '#ProductData',
    data:function(){
        return {
            products: [],
            search_item:'',
            transfer_products: cartProductsStorage.fetch(),
            new_transfer_product: {'item':null, 'quantity':null},
            transfer_details: '',
            transfer_products: [],
            stores: [],
            newTransfer :{'store':null, 'products':[], 'total_qty':0}            
            
        }
    },
    computed:{
        filteredList(){
				return this.products.filter(product =>{
						return product.article_number.toLowerCase().includes(this.search_item.toLowerCase());				
				})			
        }		
    },
    mounted:function(){
        this.getProducts();
        this.getStores();
    },
    methods:{
        getProducts(){
                let api = BASE_API+'products/';
                this.$http.get(api)
                    .then((response)=>{
                        this.products =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })         
            
        },
         getStores(){
                let api = BASE_API+'stores/';
                this.$http.get(api)
                    .then((response)=>{
                        this.stores =response.data;
                    }).catch((err)=>{
                        console.log(err);  
                    })         
            
        },        
        selectTransfer(product){
            console.log("form selection")
            console.log(product.barcode)
            console.log(product)
            this.newTransfer.total_qty ++
            var item = product
            if (!item){
                return            
            }
            this.transfer_products.push({
                        id: cartProductsStorage.uid++,
                        product:item,
                        quantity:1            
            })
            
            this.new_transfer_product = '';
            console.log(this.transfer_products)                       
        },
        increaseQuantity:function(product){
            console.log("from in")
            instance_item = product.product.barcode
            console.log(product.product.barcode)
            for(var i=0, iLen=this.transfer_products.length;i<iLen;i++){
                if(this.transfer_products[i].product.barcode == instance_item){
                        console.log(this.transfer_products[i].product)
                        console.log(this.transfer_products[i].quantity)
                        this.transfer_products[i].quantity ++
                        this.newTransfer.total_qty ++       
                }            
            }
            console.log(this.transfer_products) 
        },
        decreaseQuanity:function(product){
            console.log("from in")
            instance_item = product.product.barcode
            console.log(product.product.barcode)
            for(var i=0, iLen=this.transfer_products.length;i<iLen;i++){
                if(this.transfer_products[i].product.barcode == instance_item){
                        if(this.transfer_products[i].quantity == 0){
                             this.transfer_products.splice(this.transfer_products.indexOf(product), 1)
                        }else{
                            console.log(this.transfer_products[i].product)
                            console.log(this.transfer_products[i].quantity)
                            this.transfer_products[i].quantity --
                             this.newTransfer.total_qty --   
                        }     
                }            
            }
            console.log(this.transfer_products) 
        },
        cancelTransfer(){
            this.transfer_products=[];
            
        },
        deleteTransferProduct:function(product){
            instance_item = product.product.barcode
             for(var i=0, iLen=this.transfer_products.length;i<iLen;i++){
                if(this.transfer_products[i].product.barcode == instance_item){
                        this.newTransfer.total_qty = this.newTransfer.total_qty-this.transfer_products[i].quantity
                }            
            }
             this.transfer_products.splice(this.transfer_products.indexOf(product), 1)        
        },
        sendTransfer(){
            this.newTransfer.products=this.transfer_products
            if(this.newTransfer.total_qty == 0){
                alert("PLEAS SELECT PRODUCT")                    
            }
            if(this.newTransfer.store == null){
                alert("PLEASE SELECT STORE")            
            }
            console.log(this.newTransfer)
             this.$http.post('/api/v1/corporate/ws-product-transfer/', this.newTransfer)
                        .then((response)=>{
                            this.loading=true;
                            this.newTransfer.store=null;
                            this.newTransfer.products=null;
                            this.newTransfer.total_qty = 0
                            this.search_item = ''
                            this.transfer_products = []                                              
                        }).catch((err)=>{
                            this.loading = true;                                                   
                        })        
        }    
    },
};

const Transfers = {
    template: '#Transfers',
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

const SaleConfiguration = {
        delimiters: ['${','}'],
        template: '#SaleConfiguration',
         data:function(){
            return{
                stores: [],
                employees: [],
                warehouses: [],
                newStore: '',
                newEmp: '',
                newWareHouse: '',
                    
            }
        },
        created(){},
        mounted:function(){
            this.getStores();
            this.getEmployees();
            this.getWareHouses();
        },
        methods:{
              getStores(){
                
                },
                getEmployees(){
                
                },
                getWareHouses(){
                
                },
                addNewStore:function(){
                },
                addNewEmployee(){
                },
                addNewWareHouse(){
                }      
        },
        computed:{
            filterStores(){
            
            },
            filterdEmployees(){
            
            },
            filteredWarehouses(){
            
            },                   
        }
};  
const SalesReport = {
    delimiters: ['${','}'],
    template: '#SalesReport',
     data:function(){
        return{
            invoices : [],
            items: [],
            search_store :'',
            search_date: '',
            stores: [],
            search_employee: '',
            search_article_number: '',
            employees: [],
            search_country: '',
            search_state: '',
            search_gorup: '',
            search_gender: '',
            search_brand: '',
            search_size:'',
            search_shelve_life: '',
            search_promation: '',
            search_promo_type: '',
            search_time: '',
            search_occasion: '',
            search_neck:'',
            search_weave: '',
            search_color: '',
            search_price: '',
        }
    },
    created(){},
    mounted:function(){
        console.log("from here")
        this.getInvoices();  
        this.getStores();  
        this.getEmployees()    
    },
    methods:{
        getInvoices(){
                let api = BASE_API+'sale-items/';
                this.$http.get(api)
                    .then((response)=>{
                        this.invoices =response.data;
                        this.items = response.data;
                        console.log(this.invoices)
                    }).catch((err)=>{
                        console.log(err);  
                    })  
        },  
        getStores(){
                let api = BASE_API+'stores/';
                this.$http.get(api)
                    .then((response)=>{
                        this.stores =response.data;
                        console.log(this.invoices)
                    }).catch((err)=>{
                        console.log(err);  
                    })  
        },
        getEmployees(){
                let api = BASE_API+'store-employees/';
                this.$http.get(api)
                    .then((response)=>{
                        this.employees =response.data;
                        console.log(this.invoices)
                    }).catch((err)=>{
                        console.log(err);  
                    })  
        },   
    },
    computed:{

        filterItems(){
            var 
            items = this.items,
            store=this.search_store; 
            items = items.filter(item =>{
                                return item.store.toLowerCase().includes(this.search_store.toLowerCase());				
				})
            items = items.filter(item =>{
                                return item.bill_date.toLowerCase().includes(this.search_date.toLowerCase());				
				})
            items = items.filter(item =>{
                                return item.sold_by.toLowerCase().includes(this.search_employee.toLowerCase());				
				})
            items = items.filter(item =>{
                                return item.item.article_number.toLowerCase().includes(this.search_article_number.toLowerCase());				
				})
            
            return items;

                    
        }
           
    }
};
const MovementReport = {
    template: '#MovementReport',
     data:function(){
        return{}
    },
    created(){},
    methods:{},
};
const BestWorst = {
    template: '#BestWorst',
     data:function(){
        return{}
    },
    created(){},
    methods:{},
};
const MarketConfiguration = {
    template: '#MarketConfiguration',
     data:function(){
        return{}
    },
    created(){},
    methods:{},
};
const Discount = {
    template: '#Discount',
     data:function(){
        return{}
    },
    created(){},
    methods:{},
};
const CustomerData = {
    delimiters: ['${','}'],
    template: '#CustomerData',
     data:function(){
        return{
            customers: [],        
            loading: '',
        }
    },
  mounted:function(){
        console.log("from here")
        this.getCustomers();  
  
    },
    methods:{
        getCustomers(){
                this.loading = true
                let api = BASE_API+'customers/';
                this.$http.get(api)
                    .then((response)=>{
                        this.customers =response.data;
                        this.loading=false
                        console.log(this.customers)
                    }).catch((err)=>{
                        console.log(err); 
                        this.loading=false 
                    })  
        },          
    },
    computed:{

        filterCustomer(){
            var 
            customers = this.customers;            
            return customers;

                    
        }
           
    }
};
const Loyalty = {
    template: '#Loyalty',
     data:function(){
        return{}
    },
    created(){},
    methods:{},
};
const Staff = {
    template: '#Staff',
     data:function(){
        return{}
    },
    created(){},
    methods:{},
};
const Attendence = {
    template: '#Attendence',
     data:function(){
        return{}
    },
    created(){},
    methods:{},
};

const routes = [
    {path: '/login', component: Login},
    { path: '', component: Home,meta: { 
            requiresAuth: true
        },
     },
    { path: '/configure', component: ConfigreData },
    { path: '/add-product', component: AddProduct },
		{ path: '/product-data', component: ProductData },
    { path: '/transfers', component: Transfers },
    { path: '/sale-configurations', component: SaleConfiguration },
		{ path: '/sale-report', component: SalesReport },
    { path: '/movement', component: MovementReport },
    { path: '/best-worst', component: BestWorst },
		{ path: '/market-configurations', component: MarketConfiguration },
    { path: '/discount', component: Discount },
    { path: '/customers', component: CustomerData },
		{ path: '/loyalty', component: Loyalty },
    { path: '/staff', component: Staff },
    { path: '/attendence', component: Attendence }
	
]

const router = new VueRouter({
    routes
});

new Vue({
    router
}).$mount('#app');
