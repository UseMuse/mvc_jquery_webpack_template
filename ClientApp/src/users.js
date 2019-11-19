export const Init = function (testVariableFromController) {
    $('#messageOnThisPage').text(testVariableFromController);
    $(".dropdown-toggle").dropdown();
    console.log("run  function from users.js");
};

export default function InitDefault(message) {
    console.log(`[Lazy Loaded Run InitDefault function]: ${message}`);
}