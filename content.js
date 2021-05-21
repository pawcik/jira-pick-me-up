function findQuickFilters() {
  let visibleNodes = Array.from(document.querySelectorAll("#ghx-quick-filters * input"))
    .filter((n) =>
      n.id && n.id.startsWith("ASSIGNEE") && n.id != "ASSIGNEE-show-more"
    );
  const showMore = document.getElementById("ASSIGNEE-show-more");
  if (showMore) {
    showMore.click();
    showMoreNodes = Array.from(document.querySelectorAll("#uid1 * span[aria-checked]"))
    //Remove the unassinged from the list
    showMoreNodes.pop();
    showMoreNodes = showMoreNodes.map((node, idx) => {
      const invisble = {};
      invisble.click = () => {
        showMore.click();
        filterToClick = Array.from(document.querySelectorAll("#uid1 * span[aria-checked]"))[idx]
        filterToClick.click();
        showMore.click();
      };
      return invisble;
    });
    showMore.click();
    visibleNodes = visibleNodes.concat(showMoreNodes)
  }
  return visibleNodes;
}

function createRandomButton(onclick) {
  let parent = document.querySelectorAll("#ghx-quick-filters > ul > li:nth-child(3) > ul")[0];
  let newnode = document.querySelectorAll("#ghx-quick-filters > ul > li:nth-child(3) > ul > li")[0].cloneNode(true)
  newnode.querySelector("span").textContent = "Pick me!";
  newnode.querySelector("button").onclick = onclick;
  newnode.querySelector("button").style = "background-color: lightblue";
  parent.appendChild(newnode);
}

function randomSelect() {
  function pick(items) {
    const idx = Math.floor(Math.random() * items.length)
    const item = items[idx];
    const copyArray = Array.from(items);
    copyArray.splice(idx,1);
    return [item, copyArray];
  };

  if (notSelected.length === 0) {
    notSelected = allNodes;
  }
  const [next, others] = pick(notSelected);
  notSelected = others;
  if (currentlySelected) {
    currentlySelected.click();
  }
  next.click();
  currentlySelected = next;
}

function onViewChanges(callback) {
  const quickFilters = document.querySelector("#ghx-quick-filters");
  let observer = new MutationObserver((e) => {
    if (callback) {
      //TODO: make a smarter way to figure out how to make sure that the UI filters is loaded
      //and we are safe to manipulate the DOM
      setTimeout(callback, 2000);
    }
  });
  let config = {
    childList: true
  };
  observer.observe(quickFilters, config);
}

var allNodes = [];
var notSelected = [];
var currentlySelected = undefined;

function documentComplete() {
  function inject() {
    allNodes = findQuickFilters();
    notSelected = allNodes;
    createRandomButton(() => {
      randomSelect();
    });
  }

  onViewChanges(() => {
    inject();
  });
  inject();
}



var readyStateCheckInterval = setInterval(() => {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    documentComplete();

  }
}, 10);
