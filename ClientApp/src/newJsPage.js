export const newJsPage = function (testVariableFromController) {
    $('#messageOnThisPage').text(testVariableFromController);
    $(".dropdown-toggle").dropdown();
    console.log("hey!!!!");
};

export default function print(message) {
    console.log(`[Lazy Loaded Print Function asdasda s]: ${message}`);
}