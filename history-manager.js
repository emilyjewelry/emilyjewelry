/**
 * HistoryManager — Non-intrusive browser history management layer
 * Enables Android back button & iOS swipe-back to restore previous UI states
 * instead of exiting the browser/app.
 * 
 * Usage:
 *   HistoryManager.push('state-id', { key: value });
 *   HistoryManager.onBack('state-id', (stateData) => { ... restore UI ... });
 */
(function () {
    'use strict';

    // Prevent double-init if script is included multiple times
    if (window.HistoryManager) return;

    var _handlers = {};   // { stateId: callback }
    var _depth = 0;       // Track how many states we've pushed on this page

    /**
     * Push a new history entry for a UI state change.
     * @param {string} stateId  Unique identifier for this type of state (e.g. 'mobile-menu', 'faq-accordion')
     * @param {Object} data     Arbitrary state data to restore later
     */
    function push(stateId, data) {
        _depth++;
        var stateObj = {
            _hm: true,           // Marker so we know this is our state
            id: stateId,
            data: data || {},
            depth: _depth
        };
        history.pushState(stateObj, '');
    }

    /**
     * Register a handler that fires when the user navigates back to a state of this type.
     * The callback receives the state data that was passed to push().
     * @param {string} stateId   Must match the stateId used in push()
     * @param {Function} callback  function(stateData) — must restore the previous UI
     */
    function onBack(stateId, callback) {
        _handlers[stateId] = callback;
    }

    /**
     * Remove a registered back handler.
     * @param {string} stateId
     */
    function offBack(stateId) {
        delete _handlers[stateId];
    }

    // Listen for popstate globally
    window.addEventListener('popstate', function (e) {
        var state = e.state;

        // Only handle states that we created
        if (state && state._hm === true) {
            _depth = Math.max(0, _depth - 1);
            var handler = _handlers[state.id];
            if (typeof handler === 'function') {
                handler(state.data);
            }
        } else if (state === null && _depth > 0) {
            // User went back past all our pushed states → reset depth
            _depth = 0;
        }
    });

    // Push a base state on page load so we can intercept the first back press
    // Use replaceState so we don't add an extra entry — just tag the current entry
    history.replaceState({ _hm: true, id: '_base', data: {}, depth: 0 }, '');

    // Expose global API
    window.HistoryManager = {
        push: push,
        onBack: onBack,
        offBack: offBack
    };
})();
