parvi.controller('loginController', ['$scope', '$startService', function($scope, $startService) {

	$startService.getParseInicialization();

	$scope.login = function(form){

		if(form.$valid){
			Parse.User.logIn(form.username.$modelValue, form.password.$modelValue, {
		        // Se o nome de usuário e senha existirem
		        success: function(user) {
		            toastr.success('<i class=fa-check></i> Login bem sucedido!');
		        },
		        // Se houver algum erro
		        error: function(user, error) {
		            toastr.error('<i class=fa-times></i> Ocorreu ao tentar se logar como ' + $scope.username + ': ' +error.message);
		        }
		    });
		}	
	}

}]);

jQuery(document).ready(function($){
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
});