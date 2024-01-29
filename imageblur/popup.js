// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function blur(e) {
  sendMessage(e.target.id);
}

function removeBGImages(e) {
  sendMessage("removeBGImages");
}

function saveChanges(e) {
  let blurOnDefault = document.getElementById("defaultBlur").checked;
  let blurAmount = document.getElementById("blurAmount").value;
  let whitelist = document.getElementById("whitelist").innerText;

  // Update UI
  document.getElementById("blurAmountText").innerText = blurAmount;

  // Save settings
  chrome.storage.sync.set(
    {
      blurOnDefault: blurOnDefault,
      blurAmount: blurAmount,
      whitelist: whitelist,
    },
    function () {
      console.log("Settings saved");
    }
  );
}

function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      chrome.tabs.sendMessage(tabs[0].id, { status: message }, (response) => {});
    }
  });
}

function onWhiteListChange(e) {
  document.getElementById("whitelist").innerHTML;
}

document.addEventListener("DOMContentLoaded", function () {
  let defaultBlur = document.getElementById("defaultBlur");
  let blurAmount = document.getElementById("blurAmount");
  let blurAmountText = document.getElementById("blurAmountText");
  let whitelist = document.getElementById("whitelist");

  defaultBlur.addEventListener("click", saveChanges, false);
  blurAmount.addEventListener("input", saveChanges, false);
  whitelist.addEventListener("input", saveChanges, false);
  document.getElementById("blur").addEventListener("click", blur, false);
  document.getElementById("unblur").addEventListener("click", blur, false);
  document
    .getElementById("removeBGImages")
    .addEventListener("click", removeBGImages, false);

  chrome.storage.sync.get(
    ["blurOnDefault", "blurAmount", "whitelist"],
    function (values) {
      defaultBlur.checked = values.blurOnDefault;
      blurAmount.value = values.blurAmount || 6;
      blurAmountText.innerText = values.blurAmount || "6";
      whitelist.innerText = values.whitelist || "";
    }
  );
});
