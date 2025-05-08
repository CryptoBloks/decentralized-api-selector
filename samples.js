function checkLocalStorageSupport() {
    if (typeof Storage !== "undefined") {
        // Code for localStorage/sessionStorage.
        console.log("Local Storage is supported");
    } else {
        // No Web Storage support..
        console.log("Local Storage is not supported");
        document.getElementById(
            "results"
        ).bodyContent = `Your browser is not compatible.  Please try a different browser.`;
    }
}

function inventoryLocalStorage() {
    // print local storage items to console (for testing)
    console.log("Contents of Local storage:");
    console.log(localStorage);
}

function retrieveLocalStorage(object) {
    // get object from local storage
    console.log("Retrieving object from local storage...");
    const retrievedObject = JSON.parse(localStorage.getItem(object));
    console.log(retrievedObject);
}

function storeLocalStorage(object, data) {
    // store object in local storage
    console.log("Storing object in local storage...");
    localStorage.setItem(object, JSON.stringify(data));
}

function removeLocalStorage(object) {
    // remove object from local storage
    console.log("Removing object from local storage...");
    localStorage.removeItem(object);
}

function clearLocalStorage() {
    // remove all local storage items (for testing)
    console.log("Clearing local storage...");
    localStorage.clear();
}

async function getChainEndpoints(applicationName) {
    fetch("https://api.libre.cryptobloks.io/libre/getChainEndpoints", {
        method: "GET",
        mode: "cors",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Storing chainEndpoints in local storage..."); // for testing
            console.log(data); // for testing
            // store ChainEndpoints in local storage
            localStorage.setItem("chainEndpoints", JSON.stringify(data));
            // also generate and store applicationEndpoints in local storage
            console.log(`Generating ${applicationName} endpoints list...`); // for testing
            const service = data.service.filter(
                (service) => service.type === applicationName
            );
            const applicationEndpoints = {};
            applicationEndpoints.chainId = data.chainId;
            applicationEndpoints.expiration = data.expiration;
            applicationEndpoints.type = service[0].type;
            applicationEndpoints.nodes = service[0].nodes;
            console.log("contents of applicationEndpoints:"); // for testing
            console.log(applicationEndpoints); // for testing
            localStorage.setItem(
                applicationName,
                JSON.stringify(applicationEndpoints)
            );
        })
        .catch((error) => {
            console.log("Fetch failed for chainEndpoints:");
            console.log(error);
        });
}

// refactor:
// if expiration timestamp is older than now, fetch from getChainEndpoints API and store in local storage
// if timestamp is newer than 24 hours, use local storage
// check local storage for applicationEndpoints
// if not present, generate applicationEndpoints and store in local storage
// if present, check applicationEndpoints for expiration timestamp
// if expiration timestamp is  older than now, generate applicationEndpoints and store in local storage
// if timestamp is newer than 24 hours, use local storage

async function checkChainEndpoints(applicationName) {
    console.log("Checking chainEndpoints..."); // for testing
    // check local storage for ChainEndpoints
    // if not present, fetch from API and store in local storage
    if (localStorage.getItem("chainEndpoints") === null) {
        console.log(
            "chainEndpoints not found in local storage - retrieving from API..."
        );
        // fetch ChainEndpoints from API and store in local storage
        getChainEndpoints(applicationName);
    } else {
        // if present, check ChainEndpoints for expiration timestamp
        console.log("chainEndpoints found in local storage:");
        console.log(JSON.parse(localStorage.getItem("chainEndpoints")));
    }
}

async function generateApplicationEndpoints(applicationName) {
    const data = JSON.parse(localStorage.getItem("chainEndpoints"));
    const service = data.service.filter(
        (service) => service.type === applicationName
    );
    const applicationEndpoints = {};
    applicationEndpoints.chainId = data.chainId;
    applicationEndpoints.expiration = data.expiration;
    applicationEndpoints.type = service[0].type;
    applicationEndpoints.nodes = service[0].nodes;
    console.log("contents of applicationEndpoints:"); // for testing
    console.log(applicationEndpoints); // for testing
    localStorage.setItem(
        applicationName,
        JSON.stringify(applicationEndpoints)
    );
}

async function testApplicationEndpoints(applicationName) {
    // get applicationEndpoints from local storage
    const applicationEndpoints = JSON.parse(
        localStorage.getItem(applicationName)
    );
    console.log("contents of applicationEndpoints:"); // for testing
    console.log(applicationEndpoints); // for testing
    // get nodes from applicationEndpoints
    const nodes = applicationEndpoints.nodes;
    console.log("contents of nodes:"); // for testing
    console.log(nodes); // for testing
    // test nodes
    // Initialize variables to track the closest URL and its response time
    let closestURL = null;
    let closestResponseTime = Infinity;

    // Get the list of URLs from the nodes array, and split them into an array
    const urlList = nodes.map((node) => node.serviceUrlSecure);
    console.log("contents of urlList:"); // for testing
    console.log(urlList); // for testing

    updateResults(`Looking for the fastest endpoint...`);

    // Function to measure response time for a URL
    async function measureResponseTime(url) {
        const start = performance.now();

        try {
            // Fetch the URL via GET, store as response
            const response = await fetch(url, {
                method: "GET",
                mode: "cors", // no-cors, cors, same-origin - https://developer.mozilla.org/en-US/docs/Web/API/Request/mode - https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS - no-cors will result in http errors being ignored, all other modes will result in http errors being caught.  All hosts in the evaluation pool must have CORS enabled for this to work, either wide open, or specifcally allowing the FQDN hosting the selection code.
            });
            console.log(`Fetch received a ${response.status} from ${url}`);
            console.log(response);
            // Get the response body as text for evaluation below
            const body = await response.text();
            console.log(`Content Matches: ${body.includes(stringTest)}`); // for testing

            if (response.status === 0 && body.includes(stringTest)) {
                // If the response is 0, return the response time (only happens when cors is disabled) this is not catching http errors
                // also check that the response body includes stringTest
                const end = performance.now();
                console.log(
                    `SUCCCESS: Received ${response.status} from ${url} in ${end - start
                    } ms.`
                );
                return end - start;
            } else if (
                response.status > 199 &&
                response.status < 300 &&
                body.includes(stringTest)
            ) {
                // If the response is 2xx, return the response time
                // also check that the response body includes stringTest
                const end = performance.now();
                console.log(
                    `SUCCCESS: Received ${response.status} from ${url} in ${end - start
                    } ms.`
                );
                return end - start;
                // if body does not include stringTest, return Infinity
            } else if (!body.includes(stringTest)) {
                // this is not catching http errors
                const end = performance.now();
                console.log(
                    `FAIL: Received ${response.status} from ${url} in ${end - start
                    } ms, but response body did not include '${stringTest}'.`
                );
                return Infinity;
                // add support for redirections (302/303/307/308) - https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections
            } else {
                // If the response is anything else, return Infinity in order to skip evaluation of the URL - will need to expand error cases to better handle non-fatal failures
                const end = performance.now();
                console.log(
                    `FAIL: Received ${response.status} from ${url} in ${end - start
                    } ms.`
                );
                return Infinity;
            }
            // If fetch fails, return the error to console and move on to the next URL
        } catch (error) {
            console.log(`ERROR: Fetch failed for ${url}, with error: ${error}`);
        }
    }

    for (const url of urlList) {
        const responseTime = await measureResponseTime(url);

        if (responseTime < closestResponseTime) {
            closestURL = url;
            closestResponseTime = responseTime;
        }
    }
    console.log(`The fastest endpoint is: ${closestURL}.
        Response time: ${closestResponseTime} ms.`);
    updateResults(
        `The fastest endpoint is: ${closestURL}.
        Response time: ${closestResponseTime} ms. Redirecting in 3 seconds...`
    );

    // setTimeout(function () {
    //   location.replace(`${closestURL}`);
    // }, 3000);
}

function updateResults(message) {
    document.getElementById("results").textContent = `${message}`;
}

function replaceLocation(url) {
    location.replace(`${url}`);
}

//
// page listeners
//

// Listen for the clearStorage button to be pressed
document
    .getElementById("clearStorage")
    .addEventListener("click", async function (e) {
        clearLocalStorage();
        document.getElementById(
            "results"
        ).textContent = `local storage has been cleared`;
    });

// Listen for the inventoryStorage button to be pressed
document
    .getElementById("inventoryStorage")
    .addEventListener("click", async function (e) {
        inventoryLocalStorage();
        document.getElementById(
            "results"
        ).textContent = `local storage inventory printed to console`;
    });

// Listen for the retrieveChainEndpoints button to be pressed
document
    .getElementById("retrieveChainEndpoints")
    .addEventListener("click", async function (e) {
        retrieveLocalStorage("chainEndpoints");
    });

// Listen for the checkChainEndpoints button to be pressed
document
    .getElementById("getChainEndpoints")
    .addEventListener("click", async function (e) {
        getChainEndpoints(applicatonName);
        document.getElementById(
            "results"
        ).textContent = `chainEndpoints verified in local storage`;
    });

// Listen for the checkChainEndpoints button to be pressed
document
    .getElementById("generateApplicationEndpoints")
    .addEventListener("click", async function (e) {
        generateApplicationEndpoints(applicatonName);
        document.getElementById(
            "results"
        ).textContent = `generateApplicationEndpoints executed. See console log for results.`;
    });

// Listen for the retrieveApplicationEndpoints button to be pressed
document
    .getElementById("retrieveApplicationEndpoints")
    .addEventListener("click", async function (e) {
        retrieveLocalStorage(applicatonName);
    });

// Listen for the testApplicationEndpoints button to be pressed
document
    .getElementById("testApplicationEndpoints")
    .addEventListener("click", async function (e) {
        testApplicationEndpoints(applicatonName);
    });