if (typeof module.hot !== "undefined") {
    module.hot.accept();
}

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '../styles/site.css';

import $ from 'jquery';

window.jQuery = $;
window.$ = $;
window.jquery = $;

import 'popper.js';
import 'bootstrap';

//Add a namspace
window.MyWebApp = {};

var Routes = {
    Home: {
        init: function () {
            // controller-wide code
        },
        NewJsPage: function () {
            // action-specific code
            import(
                /* webpackChunkName: "lazy-loading-newJsPage" */
                "./newJsPage"
            ).then((module) => {
                window.MyWebApp.newJsPage = module.newJsPage;

                const print = module.default;
                print('!!!!!');

            });

          
        },
        Privacy: function () {
            // Privacy action code
        }
    },
    Users: {
        init: function () {
            // controller-wide code
        },
        Index: function () {
            import(
                /* webpackChunkName: "lazy-loading-usersPage" */
                "./users"
            ).then((module) => {
                window.MyWebApp.Users = module.Init;
                const InitDefault = module.default;
                InitDefault('run default function');
            });
        }
    }
};

var Router = {
    exec: function (controller, action) {
        action = action === undefined ? "init" : action;

        if (controller !== "" && Routes[controller] && typeof Routes[controller][action] === "function") {
            Routes[controller][action]();
        }
    },

    init: function () {
        let body = document.body;
        let controller = body.getAttribute("data-controller");
        let action = body.getAttribute("data-action");

        Router.exec(controller);
        Router.exec(controller, action);

    }
};


//run this immediately
Router.init();



