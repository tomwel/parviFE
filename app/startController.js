parvi.controller('startController', ['$scope', '$startService', function($scope, $startService) {

	$startService.getParseInicialization();
	$scope.cliente = null;
	$scope.wait = false;
	$scope.clienteList = new Array();
	$scope.confirm = false;
	$scope.username = ''; 
	$scope.password = '';
	$scope.nomeusuario = '';

  	$scope.salvarCliente = function(form){
  		if(form.$valid){

  			$scope.wait = true;

  			var Cliente = Parse.Object.extend("Cliente");
		    var cliente = new Cliente();

		    if($scope.cliente.codigo == null || $scope.cliente.codigo == undefined){
		    	cliente.save({
		      	nome: $scope.cliente.nome,
		      	email: $scope.cliente.email,
		      	num: parseInt($scope.cliente.num),
		      	url: $scope.cliente.url,
		      	card: parseInt($scope.cliente.card)
		      }, {
		      success: function(object) {
		      	$scope.cliente.codigo = object.id;
		      	$scope.clienteList.unshift($scope.cliente);
		      	$scope.cliente = null;
		      	$scope.wait = false;		      	
		      	$('#modal-6').modal('hide');
		      	$scope.$digest();
		      	toastr.success('<i class=fa-check></i> Cliente salvo com sucesso!');
		      	
		      },
		      error: function(model, error) {
		        toastr.error('<i class=fa-times></i> Ocorreu um erro ao salvar o cliente: '+error.message);
		        $scope.wait = false;
		      	$scope.$digest();
		      }
		    });
		}else{
			var query = new Parse.Query(Cliente);

			query.get($scope.cliente.codigo, {
				  success: function(cliente) {
					 cliente.set("nome", $scope.cliente.nome);
					 cliente.set("num", $scope.cliente.num);
					 cliente.set("email", $scope.cliente.email);
					 cliente.set("url", $scope.cliente.url);
					 cliente.set("card", $scope.cliente.card);
					 cliente.save();
					 $scope.getClientes();
					 $('#modal-6').modal('hide');
					 toastr.success('<i class=fa-check></i> Cliente alterado com sucesso!');
				  },
				  error: function(object, error) {
				  	$('#modal-6').modal('hide');
					toastr.error('<i class=fa-times></i> Ocorreu um erro ao salvar o cliente: '+error.message);
				  }
			});
		}

		    
  		}
  	}

  	$scope.removerCliente = function(cliente){

  		if(cliente != undefined ){

  			var Cliente = Parse.Object.extend("Cliente");
  			var query = new Parse.Query(Cliente);

  			query.get($scope.cliente.codigo, {
				  success: function(cliente) {
					 cliente.destroy({
					 	success:function(cliente){
					 		$scope.getClientes();
					 		$('#confirm').modal('hide'); 
							toastr.success('<i class=fa-check></i> Cliente removido com sucesso!');
						},
					  	error: function(object, error) {
					  		$('#confirm').modal('hide'); 
							toastr.error('<i class=fa-times></i> Ocorreu um erro ao tentar remover o cliente: '+error.message);
					  	}
					 })
				  },
				  error: function(object, error) {
				  	$('#confirm').modal('hide'); 
					toastr.error('<i class=fa-times></i> Ocorreu um erro ao tentar remover o cliente: '+error.message);
				  }
			});
  		}
  	}

  	$scope.openRemove = function(cliente){
  		$scope.cliente = angular.copy(cliente);
  		$('#confirm').modal('show', {backdrop: 'static'}); 
  	}

  	$scope.openEdit = function(cliente){
  		$scope.cliente = angular.copy(cliente);
  		$('#modal-6').modal('show',{backdrop: 'static'}); 
  	}



  	$scope.getClientes = function(){

  		$scope.clienteList = new Array();

  		var Cliente = Parse.Object.extend("Cliente");
		var query = new Parse.Query(Cliente);

		query.descending("createdAt");
		query.limit(10);

		query.find({
			success:function(results){

				for(var i = 0; i < results.length; i++){
					
					var clienteResult = {};
					
					clienteResult.codigo = results[i].id;
					clienteResult.nome = results[i].get("nome");
					clienteResult.num = results[i].get("num");
					clienteResult.email = results[i].get("email");
					clienteResult.url = results[i].get("url");
					clienteResult.card = results[i].get("card");

					$scope.clienteList.push(clienteResult);					
				}

				$scope.$digest();
			},
			error:function(error){
				//tratamento para caso de erro
				toastr.error('<i class=fa-times></i> Ocorreu um erro ao tentar Listar os clientes: '+error.message);
			}
   		});

  	}

  	$scope.login = function(form){

		if(form.$valid){
			Parse.User.logIn(form.username.$modelValue, form.password.$modelValue, {
		        // Se o nome de usuário e senha existirem
		        success: function(user) {

		        	show_loading_bar({
						pct: 99,
						finish: function(pct)
						{
							$scope.checkLogin();
							hide_loading_bar();
							location.reload();
						}
					});

		        },
		        // Se houver algum erro
		        error: function(user, error) {
		            toastr.error('<i class=fa-times></i> Ocorreu ao tentar se logar como ' + $scope.username + ': ' +error.message);
		        }
		    });
		}else{
			// Reveal Login form
			setTimeout(function(){ $(".fade-in-effect").addClass('in'); }, 1);
								
			// Validation and Ajax action
			$("form#login").validate({
				rules: {
					username: {
						required: true
					},
										
					passwd: {
						required: true
					}
				},
									
				messages: {
					username: {
						required: 'Please enter your username.'
					},
										
					passwd: {
						required: 'Please enter your password.'
					}
				}							
							
			});
						
			// Set Form focus
			$("form#login .form-group:has(.form-control):first .form-control").focus();
		}	
	}

	$scope.logOut = function(){
		Parse.User.logOut();
		location.reload();
	}

	$scope.checkLogin = function(){
		if(Parse.User.current()){
			//window.location.hash = "home";
			var user = Parse.User.current();
			$scope.nomeusuario = user.get("username");

			return 'protected/includes/home.html';

		}else{
			$scope.nomeusuario = '';
			//window.location.hash = "login";	
			//history.replaceState({}, document.title, "login");
			return 'protected/includes/login.html';
		}
	}

	$scope.checkLogin();
	$scope.getClientes();
}]);