export default {
    getFalseButtons(buttons) {
        var newButtons = {};

        for (const button of Object.keys(buttons)) {
            newButtons[button] = {};
            newButtons[button].component = buttons[button].component;
            newButtons[button].fnc = () => {};
        }

        return newButtons;
    }
}