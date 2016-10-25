(function (angular, $, _) {

    angular.module('angularex').config(function ($routeProvider) {
        $routeProvider.when('/MembershipPage', {
            controller: 'AngularexMembershipCtrl',
            templateUrl: '~/angularex/MembershipCtrl.html',

            // If you need to look up data when opening the page, list it out
            // under "resolve".
            resolve: {
                myMembership: function (crmApi) {
                    return CRM.api3('Membership', 'get', {
                        "sequential": 1
                    }).done(function (result) {
                        debugger
                        // do something
                    });
                }
            }
        });
    }
    );

    // The controller uses *injection*. This default injects a few things:
    //   $scope -- This is the set of variables shared between JS and HTML.
    //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
    //   myContact -- The current contact, defined above in config().
    angular.module('angularex').controller('AngularexMembershipCtrl', function ($scope, crmApi, crmStatus, crmUiHelp, myMembership, $timeout) {
        // The ts() and hs() functions help load strings for this module.
        var ts = $scope.ts = CRM.ts('angularex');
        var hs = $scope.hs = crmUiHelp({ file: 'CRM/angularex/MembershipCtrl' }); 

        // We have myContact available in JS. We also want to reference it in HTML.
        $scope.myForm = {};
        $scope.myForm.start_date = "2016-09-11";
        $scope.myForm.end_date = "2016-09-11";

        if (myMembership.is_error == 0) {
            $scope.myMembership = myMembership.values
        }

        $scope.filterByDate = function filterByDate(myForm) {
            $scope.myMembership = [];

            return crmStatus(
              { start: ts('Searching...'), success: ts('Got it') },
              CRM.api3('Membership', 'get', {
                  "sequential": 1,
                  "start_date": { ">=": myForm.start_date != "" ? myForm.start_date : "2016-09-11" },
                  "end_date": { "<=": myForm.end_date != "" ? myForm.end_date : "2018-09-10" }
              }).done(function (result) {
                  if (result.is_error == 0) {
                      $timeout(function () {                         
                          $scope.myMembership = result.values
                      },100);                    
                  }
              })
            );
        };
    });

})(angular, CRM.$, CRM._);
