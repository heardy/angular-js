var module = angular.module( "myApp", [] );

module.service( 'Book', [ '$rootScope', function( $rootScope ) {
    var service = {
        books: [
            { title: "Magician", author: "Raymond E. Feist" },
            { title: "The Hobbit", author: "J.R.R Tolkien" }
        ],

        addBook: function ( book ) {
            service.books.push( book );
            $rootScope.$broadcast( 'books.update' );
            console.log(service.books);
        }
    }

    return service;
}]);

var ctrl = [ '$scope', 'Book', function( scope, Book ) {
   scope.$on( 'books.update', function( event ) {
     scope.books = Book.books;
   });

   scope.books = Book.books;
 }];

 module.controller( "booksList", ctrl );

module.directive( "addBookButton", [ 'Book', function( Book ) {
    return {
     restrict: "A",
     link: function( scope, element, attrs ) {
       element.bind( "click", function() {
         Book.addBook( { title: "Star Wars", author: "George Lucas" } );
       });
     }
    }
}]);
