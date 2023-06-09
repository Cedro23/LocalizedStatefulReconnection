﻿const sessionStorageKey = 'statefulReconnection.uiState';
let isInitialized;

export function init(overlayElem) {
    if (isInitialized) {
        throw new Error('Do not add more than one instance of <StatefulReconnection.Enable>');
    }

    isInitialized = true;
    loadUIState();

    Blazor.defaultReconnectionHandler._reconnectionDisplay = new BetterReconnectionDisplay(overlayElem);

    const origOnConnectionDown = Blazor.defaultReconnectionHandler.onConnectionDown;
    Blazor.defaultReconnectionHandler.onConnectionDown = function(options, error) {
        saveUIState();

        // If no custom options were set, change the defaults
        if (options.maxRetries === 8 && options.retryIntervalMilliseconds === 20000) {
            options.retryIntervalMilliseconds = 1000;
            options.maxRetries = 10 * 60; // 10 minutes
        }

        return origOnConnectionDown.call(this, options, error);
    }

    const origOnConnectionUp = Blazor.defaultReconnectionHandler.onConnectionUp;
    Blazor.defaultReconnectionHandler.onConnectionUp = function() {
        clearUIState();
        return origOnConnectionUp.apply(this, arguments);
    }
}

class BetterReconnectionDisplay {
    constructor(overlayElem) {
        this.overlayElem = overlayElem;
    }

    show() {
        this.overlayElem.classList.add('reconnect-visible');
    }

    update(currentAttempt) {
        console.log('update');
    }

    hide() {
        this.overlayElem.classList.remove('reconnect-visible');
    }

    failed() {
        console.log('failed');
    }

    rejected() {
        console.log('rejected');
    }
} 

function loadUIState() {
    const stateJson = sessionStorage.getItem(sessionStorageKey);
    if (stateJson) {
        clearUIState();
        const state = JSON.parse(stateJson);
        for (const [selector, value] of Object.entries(state)) {
            const elem = document.querySelector(selector);
            if (elem) {
                writeElementValue(elem, value);
            }
        }
    }
}

function saveUIState() {
    const editableElements = document.querySelectorAll(['input', 'textarea', 'select']);
    const selectorCacheMap = new Map();
    const uiState = {};
    editableElements.forEach(elem => {
        const selector = toQuerySelector(elem, selectorCacheMap);
        uiState[selector] = readElementValue(elem);
    });

    sessionStorage.setItem(sessionStorageKey, JSON.stringify(uiState));
}

function clearUIState() {
    sessionStorage.removeItem(sessionStorageKey);
}

function toQuerySelector(elem, cacheMap) {
    if (cacheMap.has(elem)) {
        return cacheMap.get(elem);
    }

    let nthOfTypeIndex = 1;
    let sibling = elem.parentNode.firstElementChild;
    while (sibling !== elem) {
        if (sibling.tagName === elem.tagName) {
            nthOfTypeIndex++;
        }
        sibling = sibling.nextElementSibling;
    }

    const selector = `${elem.tagName}:nth-of-type(${nthOfTypeIndex})`;
    const result = elem === document.documentElement ? selector : `${toQuerySelector(elem.parentNode, cacheMap)} > ${selector}`;
    cacheMap.set(elem, result);
    return result;
}

function readElementValue(elem) {
    // TODO: Handle things other than input
    return elem.value;
}

function writeElementValue(elem, value) {
    // TODO: Handle things other than input
    elem.value = value;
    elem.dispatchEvent(new Event('input', { 'bubbles': true }));
    elem.dispatchEvent(new Event('change', { 'bubbles': true }));
}
