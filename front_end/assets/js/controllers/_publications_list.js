;(function(app) {
  app.controller('publicationsList', [
    '$scope',
    '$stateParams',
    'Factories',
    function($scope, $stateParams, Factories) {
      var F = Factories;
      var categoryID = $stateParams.category_id;

      function loadPublications() {
        var query = {
              limit: $scope.publications.itemsPerPage,
              category_id: categoryID,
              offset: Math.max(($scope.publications.currentPage - 1) * $scope.publications.itemsPerPage, 0)
            };

        if ($scope.publications.search) {
          query.searchTerm = $scope.publications.search.toLowerCase();
        }

        F.Publications.getPublicationCount(query).then(function(quantity) {
          $scope.publications.quantity = quantity;
        });

        F.Publications.getPublications(query).then(function(publications) {
          $scope.publications.list = publications;
        });
      }

      function changePage(newValue, oldValue) {
        if (newValue === oldValue) {return;}
        loadPublications();
        window.scrollTo(0,0);
      }

      $scope.publications.itemsPerPage = 10;
      $scope.publications.maxSize = 5;
      $scope.publications.currentCategory = categoryID;

      if (!$scope.publications.currentPage) {
        $scope.publications.currentPage = 1;
      }

      F.PublicationCategories.getCategory(categoryID).then(function(category) {
        $scope.publications.category = (categoryID !== null) ? category : null;
      });

      loadPublications();

      $scope.$watch('publications.currentPage', changePage);
      $scope.$watch('publications.search', loadPublications);
    }
  ]);
})(window.bunsen);
