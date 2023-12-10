function ueDynamicPopup(popupId, homeUrl){
  
  //objects
  var g_objGrid, g_objDynamicPopup, g_objOverlay, g_objCloseButton, g_arrowNext, g_arrowPrev, g_objIframeHolder, g_parentWidgetPopupLinks, g_objPopupButtons, g_objGridWidget, g_objArrows, g_objCarousel;
  
  //selectors
  var g_selectorPopup, g_selectorGrid, g_popupButtonSelector, g_openedPopupButtonClass;
  
  //classes
  var g_activeClass, g_classPopupOpened, g_singleDynamicPopupClass;
  
  //attributes
  var g_isDebugOn, g_isInEditor, g_templateId, g_debugConsole;
  
  //debug
  var g_showDebug = false;
  
  //indexes
  var g_openedPopupIndex;
  
  //helpers
  var g_arrowsTopPosition, g_equalDataPostLinksNum, g_isPopupSingle, g_time, g_loadingTimer, g_cache = {}, g_curentIndex = 0;
  
  /**
  * trace
  */
  function trace(val){
    
    console.log(val)
    
  }
  
  /**
  * get offsets distance
  */
  function getOffsetsDistance(offset1, offset2){
    
    var dx = offset2.left-offset1.left;
    var dy = offset2.top-offset1.top;
    
    return Math.sqrt(dx*dx+dy*dy); 
  }
  
  /**
  * get closest object by offset
  */
  function getClosestByOffset(objParents, objElement, isVertical){
    
    if(objParents.length == 0){
      throw new Error("get closest by offset error - grids not found");
    }
    
    if(g_showDebug == true){
      
      trace("get closest grids for");
      trace(objElement)
      trace("parents");
      trace(objParents);
    }
    
    var objClosest = null;
    var minDiff = 1000000;
    
    var elementOffset = objElement.offset();
    
    jQuery.each(objParents, function(index, parent){
      
      var objParent = jQuery(parent);
      
      var objGrid = jQuery(parent);	//return this one
      
      var distance = 0;
      
      var isVisible = objParent.is(":visible");
      
      var constantHeight = null;
      
      if(isVisible == false){
        objParent = objParent.parent();
      }
      
      var parentOffset = objParent.offset();
      
      if(isVertical == true){
        
        var offsetY = elementOffset.top;
        var parentY = parentOffset.top;
        
        //get bottom of the parent
        if(parentY < offsetY)
        parentY += objParent.height();
        
        var distance = Math.abs(offsetY - parentY);
        
      }else{
        
        var parentOffset = objParent.offset();
        
        var distance = getOffsetsDistance(parentOffset, elementOffset);
      }
      
      if(g_showDebug == true){
        
        trace(objParent);
        trace("distance: " + distance);
        
        trace("is vertical: " + isVertical);
      }                       
      
      
      if(distance < minDiff){
        minDiff = distance;
        objClosest = objGrid;
      }
      
    });
    
    if(g_showDebug == true){
      
      trace("popup: ");
      trace(objElement);
      
      trace("Closest grid found:");
      trace(objClosest);
    }
    
    
    return(objClosest);
  }
  
  /**
  * get all grids
  */
  function getAllGrids(){
    
    var objGrids = jQuery(g_selectorGrid);
    
    return(objGrids);
  }
  
  /**
  * get grid from parents containers
  */
  function getGridFromParentContainers(objSource){
    
    var objParents = objSource.parents();
    var objGrid = null;
    
    objParents.each(function(){
      
      var objParent = jQuery(this);
      
      objGrid = objParent.find(g_selectorGrid);
      
      //if grid found return it and exit loop 
      if(objGrid.length == 1)
      return(false);
      
    });	
    
    return(objGrid);
  }
  
  /**
  * get closest grid to some object
  */
  function getClosestGrid(objSource){
    
    //in case there is only one grid - return it
    if(g_objGrid)
    return(g_objGrid);
    
    //in case there are nothing:
    var objGrids = getAllGrids();
    
    if(objGrids.length == 0)
    return(null);
    
    //get grid from current section
    
    var objSection = objSource.parents("section");    
    var objGrid = objSection.find(g_selectorGrid);
    
    if(objGrid.length == 1)
    return(objGrid);
    
    //get grid from elementor tab    
    var objElementorTab = objSource.parents(".e-n-tabs-content > .e-con");    
    var objGrid = objElementorTab.find(g_selectorGrid);
    
    if(objGrid.length == 1)
    return(objGrid);
    
    var objGrid = getGridFromParentContainers(objSource);
    
    if(objGrid && objGrid.length == 1)
    return(objGrid);
    
    //get closest by offset
    
    var objSingleGrid = getClosestByOffset(objGrids, objSource, true);
    
    if(objSingleGrid && objSingleGrid.length == 1)
    return(objSingleGrid);		
    
    //return first grid in the list
    
    var objFirstGrid = jQuery(objGrids[0]);
    
    return(objFirstGrid);
  }
  
  function initDynamicPopup(objDynamicPopup){
    
    var objGrid = getClosestGrid(objDynamicPopup);
    
    if(!objGrid)
    return(false);
    
    //bind grid to popup
    objDynamicPopup.attr("data-grid", objGrid.attr('id'));
    
    if(objGrid.data('dynamic-popup') == '')
    return(false);
    
    //bind popup to grid
    objGrid.attr("data-dynamic-popup", objDynamicPopup.attr('id'));
    
  }
  
  function initDynamicPopups(){
    
    var objDynamicPopups = jQuery(g_selectorPopup);
    
    if(objDynamicPopups.length == 0)
    return(false);
    
    jQuery.each(objDynamicPopups, function(index, popup){
      
      var objDynamicPopup = jQuery(popup);
      
      initDynamicPopup(objDynamicPopup);
      
    });
  }
  
  /*
  * get popup link
  */
  function getPopupLink(){
    
    var popupLink;
    
    //find post link
    popupLink = g_objDynamicPopup.attr("data-src");
    
    if(g_debugConsole == true){
      
      trace(g_objDynamicPopup)
      trace('popupLink')
      trace(popupLink)
      
    }
    
    //if debug is on and is in editor then use custom post link
    if(g_isDebugOn == true && g_isInEditor == 'yes')
    popupLink = g_objIframeHolder.data('debug-post');
    
    return(popupLink);
    
  }  
  
  
  /*
  * open all links inside iframe in parent window
  */
  function setLinkTargetToParent(objIframe){
    
    var isTargetParent = g_objDynamicPopup.data("link-target-parent");
    
    if(isTargetParent == false)
    return(false);
    
    //find all links inside iframe
    var objLinks = objIframe.contents().find("a");
    
    objLinks.each(function(){
      
      var objLink = jQuery(this);
      
      //modify target attibute in each link object 
      objLink.attr("target", "_parent");
      
    });
    
  }
  
  /**
  * get iframe src
  */
  function getIframeSrc(url){
    
    var iframeBaseSrc;
    
    if(!url)
    iframeBaseSrc = getPopupLink();
    else
    iframeBaseSrc = url;
    
    var urlIframe = iframeBaseSrc + '?ucrendertemplate='+g_templateId; 
    
    return(urlIframe);
    
  }
  
  /*
  * Function to pull data from cache
  */
  function getDataFromCache(src) {
    
    if (g_cache[src]) {
      
      // Access and manipulate the cached iframe content here
      var iframe = g_cache[src];
      
      // Perform operations with the cached iframe content
      
      return(iframe)
    } 
    
  }
  
  /*
  * create iframe and place it inside popup widget fpr ajax
  */
  function createIframeForAjaxFirstGridItem(){
    
    //start the timer
    g_time = 0.000;
    
    g_loadingTimer = setInterval(function(){
      
      g_time += 0.001
      
    }, 1);
    
    var urlIframe = getIframeSrc();    
    
    var iframeHtml = '<iframe class="uc-iframe" style="display:none;" src="" frameborder="0" ></iframe>';
    
    //find iframe holder and put iframe html  
    //check if first grid item was clicked, if so do not replcae html
    g_objIframeHolder.html(iframeHtml);    
    
    var objIframe = g_objDynamicPopup.find("iframe"); 
    
    //load with ajax if needed    
    ajaxLoad(urlIframe, objIframe);
    
    
  }
  
  /**
  * get url iframe 
  */
  function getUrlIframe(objLink){
    
    var dataPostLink = objLink.data("post-link");
    var urlIframe = getIframeSrc(dataPostLink); 
    
    return(urlIframe);
    
  }
  
  /**
  * load popup
  */
  function loadPopup(urlIframe){ 
    
    //add data to cache
    jQuery.get(urlIframe, function(data){
      
      g_cache[urlIframe] = data;       
      
      if(g_debugConsole == true)
      trace('loaded to cache: '+ urlIframe);
      
    });
    
  }
  
  /*
  * check if next iframe is loaded to cahce, if not - load it
  */
  function loadPopupsToCahce(){
    
    g_parentWidgetPopupLinks = g_objGridWidget.find(g_popupButtonSelector); 
    
    var activeIndex = 0;
    
    g_parentWidgetPopupLinks.each(function(index, link){
      
      var objLink = jQuery(this);
      
      if(objLink.hasClass(g_openedPopupButtonClass) == true){
        
        var dataPopupNum = objLink.data("dynamic-popup-num");
        
        activeIndex = dataPopupNum;
        
      }
      
    });
    
    //if first item is currently loaded then do nothing
    if(activeIndex == 0)
    return(false);
    
    var objLink = g_objGridWidget.find('[data-dynamic-popup-num="'+(activeIndex+1)+'"]');
    var urlIframe = getUrlIframe(objLink); 
    
    //if no data in cache with such key then add it
    if(!g_cache[urlIframe]){
      
      if(g_debugConsole == true)
      trace("no such poup loaded in cache: "+urlIframe);        
      
      loadPopup(urlIframe);
      
    }else{
      
      if(g_debugConsole == true)
      trace("this popup is loaded in cache: "+urlIframe);
      
      //if next popup is loaded, load previous one
      objLink = g_objGridWidget.find('[data-dynamic-popup-num="'+(activeIndex-1)+'"]');
      
      urlIframe = getUrlIframe(objLink); 
      
      if(!g_cache[urlIframe])
      loadPopup(urlIframe);
      else{
        if(g_debugConsole == true)
        trace('this iframe is loaded too: '+urlIframe)
      }
      
    }
    
  }
  
  /*
  * create iframe and place it inside popup widget
  */
  function createIframe(){
    
    //make sure arrows on their place
    g_objArrows.css('top', '');
    
    objLoader = g_objDynamicPopup.find('.ue-loader');
    
    //show loader
    objLoader.show();
    
    //start the timer
    g_time = 0.000;
    
    g_loadingTimer = setInterval(function(){
      
      g_time += 0.001
      
    }, 1);
    
    var urlIframe = getIframeSrc();    
    
    //create html for iframe
    var iframeHtml;
    
    iframeHtml = '<iframe class="uc-iframe" style="display:none;" src="" frameborder="0" ></iframe>';
    
    //find iframe holder and put iframe html  
    //check if first grid item was clicked, if so do not replcae html
    var objPopupLink = g_objGridWidget.find('[data-dynamic-popup-num="'+g_openedPopupIndex+'"]');
    var isPopupLoaded = objPopupLink.hasClass("grid-item-loaded"); 
    
    if(g_debugConsole == true){
      
      trace('isPopupLoaded')
      trace(isPopupLoaded)
      trace('objPopupLink')
      trace(objPopupLink)
      
    }
    
    if(isPopupLoaded == false){
      g_objIframeHolder.html(iframeHtml);  
      
    }
    
    //add active class to overlay if not first grid item
    g_objOverlay.addClass(g_activeClass); 
    
    var objIframe = g_objDynamicPopup.find("iframe");
    
    
    //load with ajax if needed
    if(isPopupLoaded == false){
      
      ajaxLoad(urlIframe, objIframe);
      
      if(g_debugConsole == true){
        
        trace('ajax loaded')
        
      }
      
      var objAllLoadedPopuplinks = jQuery(".uc-open-popup.grid-item-loaded");
      
      if(objAllLoadedPopuplinks && objAllLoadedPopuplinks.length > 0)
      objAllLoadedPopuplinks.removeClass('grid-item-loaded');
      
    }
    
    //wait while iframe is loaded
    objIframe.load(function(e){     
      
      //hide loader
      objLoader.hide();
      
      //show iframe
      objIframe.show();
      
      //find header and footer in iframe and remove them            
      var objIframeHeader = objIframe.contents().find("header");
      var objIframeFooter = objIframe.contents().find("footer");
      
      //remove margin top from inner html
      var objInnerHtml = objIframe.contents().find("html");
      
      if(objInnerHtml.length){
        
        if(objInnerHtml.css('margin-top') != 0){
          
          var objHead = objIframe.contents().find("head");
          var styleHtml = "<style>html{margin-top:0 !important}</style>";
          
          objHead.append(styleHtml);
          
        }
        
      }      
      
      //remove header and footer from iframe
      if(objIframeHeader.length)
      objIframeHeader.remove();
      
      if(objIframeFooter.length)
      objIframeFooter.remove();
      
      //set all link's target attribute to _parent if needed
      setLinkTargetToParent(objIframe);    
      
      //adjust height of iframe holder if needed
      adjustHeight(objIframe);
      
      jQuery(e.target.contentWindow).on('scroll', function(scroll) {
        
        scrollArrowsWithIframe(scroll, g_arrowsTopPosition)
        
      });
      
    });
    
  }
  
  /*
  * find parent widget popup links to navigate through parent widget posts
  */
  function findParentWidgetPopupLinks(){
    
    //find all popup buttons
    g_parentWidgetPopupLinks = g_objGridWidget.find(g_popupButtonSelector); 
    
    //find opened popup index
    g_parentWidgetPopupLinks.each(function(index, link){
      
      var objLink = jQuery(this);
      
      //set data num attribute for popup links navigation
      objLink.attr('data-dynamic-popup-num', index);
      
      //find all links with equal data post link (each post item can have several dynamic popup links)
      var dataPostLink = objLink.data('post-link');
      
      var objEqualDataPostLinks = g_objGridWidget.find('[data-post-link="'+dataPostLink+'"]');
      
      //post carousels might have cloned items which counts as equal data-post-link attributes, so in such widgets use only one dynamic popup per item
      if(objEqualDataPostLinks.hasClass(g_singleDynamicPopupClass) == false){        
        
        g_equalDataPostLinksNum = objEqualDataPostLinks.length;
        
        var popupItemIndex = Math.floor(index / g_equalDataPostLinksNum);
        
        //reset data-dynamic-popup-num attr
        objEqualDataPostLinks.attr('data-dynamic-popup-num', popupItemIndex);
        
      }
      
      //post carousels might have cloned items which counts as equal data-post-link attributes, so in such widgets use only one dynamic popup per item
      if(objEqualDataPostLinks.hasClass(g_singleDynamicPopupClass) == true)
      g_isPopupSingle = true; //this var helps with nav aarrows
      
      
      //if no opened class found skip
      if(objLink.hasClass(g_openedPopupButtonClass) == false)
      return(true);
      
      //get index of parent item with opened popup link
      g_openedPopupIndex = objLink.data('dynamic-popup-num'); 
      
    });
    
  }
  
  /*
  * clear popup (not working in editor)
  */
  function clearPopup(){
    
    if(g_isDebugOn == true && g_isInEditor == 'yes')
    return(false);
    
    g_objOverlay.removeClass(g_activeClass);
    
    //remove data src to prevent same post opening in popup
    g_objDynamicPopup.removeData('src');
    
    jQuery('body').removeClass(g_classPopupOpened);
    
  }
  
  /*
  * click on arrow right
  */
  function onArrowNextClick(){
    
    if(!g_objPopupButtons)
    return(false);    
    
    //if g_openedPopupIndex >= items amount reset g_openedPopupIndex
    var itesmAmount;
    
    //post carousels might have cloned items which counts as equal data-post-link attributes, so in such widgets use only one dynamic popup per item
    if(g_isPopupSingle == true)
    itesmAmount = g_objPopupButtons.length;  
    else
    itesmAmount = g_objPopupButtons.length / g_equalDataPostLinksNum;   //consider equal popups inside one item
    
    g_openedPopupIndex++;
    
    if(g_openedPopupIndex >= itesmAmount)
    g_openedPopupIndex = 0;    
    
    //there are can be several popup links with same dynamic popup num attribute
    var objNextParentPopupLinks = g_objGridWidget.find('[data-dynamic-popup-num="'+g_openedPopupIndex+'"]');
    
    clearPopup();

    //trigger click only on first popup link
    objNextParentPopupLinks.each(function(index, link){

      var objNextPopupLink = jQuery(this);

      if(index == 0)
      objNextPopupLink.trigger('click');

    });
        
  }
  
  /*
  * click on arrow left
  */
  function onArrowPrevClick(){
    
    if(!g_objPopupButtons)
    return(false);
    
    var itesmAmount = g_objPopupButtons.length / g_equalDataPostLinksNum; //consider equal popups inside one item
    
    //post carousels might have cloned items which counts as equal data-post-link attributes, so in such widgets use only one dynamic popup per item
    if(g_isPopupSingle == true)
    itesmAmount = g_objPopupButtons.length;
    
    if(g_openedPopupIndex == 0)
    g_openedPopupIndex = itesmAmount;
    
    g_openedPopupIndex--;
    
    var objPrevParentPopupLinks = g_objGridWidget.find('[data-dynamic-popup-num="'+g_openedPopupIndex+'"]');
    
    clearPopup();
    
    //trigger click only on first popup link
    objPrevParentPopupLinks.each(function(index, link){

      var objPrevPopupLink = jQuery(this);

      if(index == 0)
      objPrevPopupLink.trigger('click');

    });
    
  }
  
  /**
  * imitate arrows inside iframe
  */
  function scrollArrowsWithIframe(e, arrowsTopPosition){
    
    if(!g_objArrows.length)
    return(false);
    
    var dataArrowsAlwaysOnTop = g_objDynamicPopup.data('arrows-on-top');
    
    if(dataArrowsAlwaysOnTop == true)
    return(false);   
    
    var scrollAmount = e.currentTarget.scrollY;
    
    g_objArrows.css('top', 'calc('+(arrowsTopPosition-scrollAmount)+'px)');
    
  }
  
  /*
  * open popup
  */
  function onOpenDynamicPopup(){
    
    jQuery('body').addClass(g_classPopupOpened);
    
    findParentWidgetPopupLinks();
    
    createIframe();      
    
  }
  
  /*
  * debug popup for styling
  */
  function debugPopup(){
    
    if(g_isDebugOn == false)
    return(false);
    
    if(g_isInEditor == 'no')
    return(false);
    
    createIframe();      
    
  }
  
  /**
  * click on popup link
  */
  function onPopupBtnClick(e){
    
    // if(!g_objPopupButtons.length)
    // return(false);
    
    var objPopupLink = jQuery(this);     
    var popupLink = objPopupLink.attr("href");
    
    var objGrid = objPopupLink.parents('.uc-dynamic-popup-grid');
    var objPopupWidgetId = objGrid.data('dynamic-popup');
    var objPopupWidget = jQuery("#"+objPopupWidgetId);
    
    if(g_debugConsole == true){
      
      trace('num to set')
      trace(g_openedPopupIndex)
      trace('onPopupBtnClick')
      
    }
    
    g_objIframeHolder.attr('data-dynamic-popup-num', g_openedPopupIndex);
    
    //add data src attribute to dynamic popup widget
    if(objPopupLink.hasClass('grid-item-loaded') == false){
      objPopupWidget.attr("data-src", popupLink);
    }
    
    //remove active class from other buttons
    g_objPopupButtons.removeClass(g_openedPopupButtonClass);
    
    //add active class to current button
    objPopupLink.addClass(g_openedPopupButtonClass);
    
    //trigger custom event to open popup
    objPopupWidget.trigger("open_dynamic_popup");

    e.preventDefault();
    
  }
  
  //enable popup links after js load
  function enablePopupLink(objButtons){
    
    if(!objButtons.length)
    return(false);
    
    for(let i=0; i<objButtons.length; i++){
      
      var objLink = objButtons.eq(i); 	
      var dataLinkHref = objLink.data('post-link')
      
      objLink.attr("href", dataLinkHref); 
      
      //set target attr to _blank just to be sure
      objLink.attr("target", '_blank'); 
      
    } 
    
  }
  
  /**
  * adjust height to the content inside
  */
  function adjustHeight(objIframe){
    
    var dataAdjustHeight = g_objIframeHolder.data('adjust-height');
    
    if(dataAdjustHeight == false)
    return(false);
    
    var objInnerDocument = objIframe.contents().find('body');
    var objInnerDocumentHeight = objInnerDocument.height();
    
    //consider border-width
    var borderTopWidth = parseInt(objIframe.css('border-top-width'));
    var borderBottomWidth = parseInt(objIframe.css('border-bottom-width'));
    
    var iframHolderPaddingTop = parseInt(g_objIframeHolder.css("padding-top"));
    var iframHolderPaddingBottom = parseInt(g_objIframeHolder.css("padding-bottom"));
    
    var totalHeight = objInnerDocumentHeight;
    
    if(borderTopWidth)
    totalHeight += borderTopWidth;
    
    if(borderBottomWidth)
    totalHeight += borderBottomWidth;
    
    if(iframHolderPaddingTop)
    totalHeight += iframHolderPaddingTop;
    
    if(iframHolderPaddingBottom)
    totalHeight += iframHolderPaddingBottom;
    
    objIframe.css({
      'height': totalHeight+'px',
      'max-height': '100vh'
    });
    
    g_objIframeHolder.css({
      'height': totalHeight+'px',
      'max-height': '100vh'
    });
    
    
  }
  
  /**
  * enable links, reinit vars
  */
  function initPopupLinks(){
    
    //find new popup links
    g_objPopupButtons = g_objGridWidget.find(g_popupButtonSelector);
    
    //enable links again
    enablePopupLink(g_objPopupButtons);
    
    //do same action on new popup links click
    g_objPopupButtons.on("click", onPopupBtnClick);
    
  }
  
  /**
  * get url iframe
  */
  function onGetUrlIframe(data, objIframe){
    
    var iframeDocument;
    
    if(objIframe[0])
    iframeDocument = objIframe[0].contentDocument
    
    if(objIframe[0].contentWindow)
    iframeDocument = objIframe[0].contentWindow.document;
    
    // Write the HTML content to the iframe's document
    if(iframeDocument){
      
      iframeDocument.open();
      iframeDocument.write(data);
      iframeDocument.close();
      
    }
    
    
    if(g_debugConsole == true){
      
      trace("Ajax Popup Load Time is: "+g_time.toFixed(3)+" s")
      clearInterval(g_loadingTimer)
      
    }
    
    objIframe.show();    
    
  }
  
  /**
  * load first grid item popup
  */
  function loadFirstGridItemPopup(){
    
    //find connected grid first iitem url
    var objFirstGridItemSrc = g_objGridWidget.find('[data-dynamic-popup-num="0"]');
    var firstGridItemSrc = objFirstGridItemSrc.data('post-link');
    
    objFirstGridItemSrc.addClass("grid-item-loaded")
    
    //set data-src attr to poopup widget
    g_objDynamicPopup.attr('data-src', firstGridItemSrc);
    
    //create iframe without clicking on popup element
    createIframeForAjaxFirstGridItem();
    
  }
  
  /**
  * ajax loading
  */
  function ajaxLoad(urlIframe, objIframe){
    
    var cachedData = getDataFromCache(urlIframe);
    
    if(g_debugConsole == true){
      
      trace("cachedData:")
      trace(cachedData)
      
    }
    
    if(cachedData){
      
      onGetUrlIframe(cachedData, objIframe); 
      
      if(g_debugConsole == true)
      trace("loaded from cache");      
      
      //loads next popup after opening one of them
      loadPopupsToCahce();
      
      return(false);
      
    }
    
    jQuery.get(urlIframe, function(data){
      
      if(g_debugConsole == true){
        
        trace('loaded url')
        
      }
      
      //if no data in cache with such key then add it
      if(!g_cache[urlIframe])
      g_cache[urlIframe] = data;
      
      onGetUrlIframe(data, objIframe);  
    
      //loads next popup after opening one of them
      setTimeout(loadPopupsToCahce,1000);

    });        
    
  }
  
  /**
  * set link atributes
  */
  function setPopupLinkAttributes(objLink, postLink, index){
    
    objLink.attr("data-post-link", postLink);
    objLink.attr("href", postLink);
    objLink.attr("data-dynamic-popup-num", index);
    
  }
  
  
  /**
  * adjust dynamic popup num attr for loop widgets
  */
  function adjustDynamicPopupNumAttrInLoops(){

    //find all popup buttons
    g_parentWidgetPopupLinks = g_objGridWidget.find(g_popupButtonSelector); 
    
    g_parentWidgetPopupLinks.each(function(index, link){
      
      var objLink = jQuery(this);
      
      //find loop item
      var objLoopItem = objLink.parents(".ue-grid-item");
      
      if(!objLoopItem || !objLoopItem.length)
      return(true);
      
      var postLink = objLoopItem.data("link");
      var tagName = objLink.prop("tagName");
      
      if(tagName != "A"){
        
        var objNewTag = jQuery("<a></a>");
        
        jQuery.each(objLink[0].attributes, function(index, attribute) {
          
          objNewTag.attr(attribute.name, attribute.value);
          
        });
        
        objLink.replaceWith(objNewTag.html(objLink.html()));

        //update popup btn obj var after replacing html
        g_objPopupButtons = g_objGridWidget.find(g_popupButtonSelector); 

        setPopupLinkAttributes(objNewTag, postLink, index);
        
      }
      
      setPopupLinkAttributes(objLink, postLink, index);
      
      var objEqualDataPostLinks = g_objGridWidget.find('[data-post-link="'+postLink+'"]');
      
      //post carousels might have cloned items which counts as equal data-post-link attributes, so in such widgets use only one dynamic popup per item
      if(objEqualDataPostLinks.hasClass(g_singleDynamicPopupClass) == false){        
        
        var equalDataPostLinksNum = objEqualDataPostLinks.length;
        
        var popupItemIndex = Math.floor(index / equalDataPostLinksNum);
        
        //reset data-dynamic-popup-num attr
        objEqualDataPostLinks.attr('data-dynamic-popup-num', popupItemIndex);
        
      }
      
    });
    
    
  }
  
  /**
  * get object property
  */
  function getVal(obj, name, defaultValue){
    
    if(!defaultValue)
    var defaultValue = "";
    
    var val = "";
    
    if(!obj || typeof obj != "object")
    val = defaultValue;
    else if(obj.hasOwnProperty(name) == false){
      val = defaultValue;
    }else{
      val = obj[name];			
    }
    
    return(val);
  }
  
  /**
  * init the globals
  */
  function initGlobals(){
    
    if(typeof g_strFiltersData === "undefined")
    return(false);
    
    g_filtersData = JSON.parse(g_strFiltersData);
    
    var isShowDebug = getVal(g_filtersData, "debug");
    
    if(isShowDebug == true)
    g_debugConsole = true;
    
  }
  
  /**
  * init the popup
  */
  function initPopup(){
    
    //init vars
    g_ajaxFirstLoadedClass = "ue-ajax-first-loaded";
    
    g_selectorPopup = '.ue-dynamic-popup';
    g_selectorGrid = '.uc-dynamic-popup-grid';
    
    
    g_objDynamicPopup = jQuery("#"+popupId);    
    
    g_objOverlay = g_objDynamicPopup.find(".ue-dynamic-popup-overlay");
    g_objCloseButton = g_objDynamicPopup.find(".ue-dynamic-popup-close");
    g_arrowNext = g_objDynamicPopup.find('.ue-dynamic-popup-next-arrow');
    g_arrowPrev = g_objDynamicPopup.find('.ue-dynamic-popup-prev-arrow');
    
    
    g_objArrows = g_objDynamicPopup.find('.ue-dynamic-popup-arrows'); 
    g_arrowsTopPosition = parseInt(g_objArrows.css('top'));
    
    
    g_objIframeHolder = g_objDynamicPopup.find('.ue-dynamic-popup-iframe-holder');
    g_isDebugOn = g_objIframeHolder.data('debug');
    g_isInEditor = g_objDynamicPopup.data('editor');
    g_templateId = g_objDynamicPopup.data('template');
    g_debugConsole = g_objDynamicPopup.data("debug-console");
    
    g_activeClass = "uc-active";
    g_classPopupOpened = "ue-popup-opened";
    g_singleDynamicPopupClass = 'ue-dynamic-popup-single';
    
    //parent widget vars
    g_popupButtonSelector = '.uc-open-popup';
    g_openedPopupButtonClass = 'uc-opened'; 
    
    g_openedPopupIndex = 0;
    
    //bind popups to grids
    initDynamicPopups();
    
    //init events
    var objGridId = g_objDynamicPopup.data('grid');
    
    g_objGridWidget = jQuery('#'+objGridId);  
    g_objPopupButtons = g_objGridWidget.find(g_popupButtonSelector); 
        
    //enable popup links in grid
    enablePopupLink(g_objPopupButtons);
    
    //eneble links after ajax refreshed
    findParentWidgetPopupLinks(g_objGridWidget);  
    
    //adjust loop popup num attrs
    adjustDynamicPopupNumAttrInLoops();
        
    //ajax load first grid item popup automatically after page load
    loadFirstGridItemPopup();
    
    //init events
    g_objPopupButtons.on("click", onPopupBtnClick);     

    //after ajax filters enable link again
    g_objGridWidget.on('uc_ajax_refreshed', initPopupLinks);
    
    //after carousel resize enable link again
    g_objGridWidget.on('resized.owl.carousel', initPopupLinks);
    
    g_objDynamicPopup.on("open_dynamic_popup", onOpenDynamicPopup);
    
    g_objCloseButton.on("click", clearPopup);
    
    //close popup unless target isn't iframe holder object (for styling) or arrows (not working in editor)
    g_objOverlay.on("click", function(event){
      
      var iframeHolder = g_objDynamicPopup.find(".ue-dynamic-popup-iframe-holder");
      var navArrow = g_objDynamicPopup.find('.ue-dynamic-popup-arrow');
      
      if (jQuery(event.target).closest(navArrow).length)
      return(true);
      
      if (!jQuery(event.target).closest(iframeHolder).length)
      clearPopup();
      
    });
    
    var dataShowArrows = g_objDynamicPopup.data('arrows');
    
    if(dataShowArrows == true){    
      
      g_arrowNext.on('click', onArrowNextClick);
      g_arrowPrev.on('click', onArrowPrevClick);
      
    }
    
    
    //show message if no template found
    if(g_isInEditor == "yes"){
      
      var objMessage = g_objDynamicPopup.find(".uc-editor-message");
      
      if(g_templateId == '')
      objMessage.append("<br>Please choose a template.");
      
      debugPopup();
      
    } 
    
    //show debug console data
    initGlobals();
    
  }
  
  //wait until other scripts will load (exmpl: carousel)
  setTimeout(initPopup,800);
  
  
}