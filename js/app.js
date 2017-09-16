var map;

// 建立一个空数组存放地图标记, 声明全局变量
var markers = [];
var largeInfowindow, defaultIcon, highlightedIcon;

// 初始的地点
var locations = [
  {id: 0, name: '黄浦公园', location: {lat: 31.241431, lng: 121.49082}},
  {id: 1, name: '上海半岛酒店', location: {lat: 31.24112, lng: 121.488706}},
  {id: 2, name: '东方明珠电视塔', location: {lat: 31.239689, lng: 121.499755}},
  {id: 3, name: '浦东发展银行', location: {lat: 31.235965, lng: 121.490024}},
  {id: 4, name: '南京路步行街', location: {lat: 31.234721, lng: 121.474898}},
  {id: 5, name: '和平饭店', location: {lat: 31.239039, lng: 121.489543}},
  {id: 6, name: '上海新协通国际大酒店', location: {lat: 31.240288, lng: 121.482301}},
  {id: 7, name: '上海大酒店', location: {lat: 31.235238, lng: 121.481386}},
  {id: 8, name: '金外滩宾馆', location: {lat: 31.231814, lng: 121.481731}},
  {id: 9, name: '上海人民广场', location: {lat: 31.22967, lng: 121.476161}}
];

// 地图初始化
function initMap() {
  // 引入个性化的地图样式
  var styledMapType = new google.maps.StyledMapType([
      {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#e0efef"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "hue": "#1900ff"
          },
          {
            "color": "#c0e8e8"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "lightness": 100
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "lightness": 700
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#7dcdcd"
          }
        ]
      }
    ],
    {name: '个性化'});
  // 构建地图, 中心为上海外滩, 缩放为15, 有三种样式可选(默认, 卫星地图, 个性化样式)
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 31.239263, lng: 121.48965},
    zoom: 15,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'styled_map']
    }
  });
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  largeInfowindow = new google.maps.InfoWindow();

  // 设定默认标记地图标记颜色
  defaultIcon = makeMarkerIcon('337AB7');

  // 设定鼠标悬浮在地图标记上时标记的颜色
  highlightedIcon = makeMarkerIcon('FC9A03');

  // 根据十个初始地点建立地图标记并显示在地图上
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++) {
    // 从locations数组中获取地点
    var position = locations[i].location;
    var name = locations[i].name;
    // 给每一个地点设置一个标记并存入markers数组
    var marker = new google.maps.Marker({
      position: position,
      name: name,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // 将地图标记存放在markers数组中
    markers.push(marker);
    // 为标记添加鼠标单击事件, 单击后显示信息窗口, 标记弹跳
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
      toggleBounce(this);
    });

    // 为标记添加鼠标移入和移出事件, 改变标记颜色
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// 在标记被点击时, 向信息窗口填入基于标记坐标的内容
function populateInfoWindow(marker, infowindow) {
  // 检查信息窗口是否已经打开
  if (infowindow.marker != marker) {
    // 清空内容, 加载街景内容
    //infowindow.setContent('<ul id ="NTarticle">' + marker.name + '</ul>');
    //  var urlNT = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    //  urlNT += '?' + $.param({
    //          'api-key': "1d89947ec0204b0e8aed5c9173f3f2db",
    //          'q': marker.name,
    //          'sort': "newest"
    //      });
    //  $.getJSON(urlNT, function(data) {
    //      //console.log(data);
    //      var articles = data.response.docs;
    //      for(var i =0; i < articles.length; i++){
    //          var art = articles[i];
    //          $('#NTarticle').append(
    //              '<li>'+'<a href="'+art.web_url+'">'+art.headline.main+'</a>'+'<p>'+art.snippet+'</p>'+'</li>'
    //          );
    //      }
    //  }).error(function(){
    //      $('#NTarticle').text('New York Times Articals Could Not Be Loaded');
    //  });
      const url = 'http://api.map.baidu.com/panorama/v2';
      const params = $.param({
          'ak': "p1bjfld6T3rwcqWMRHE5GhBvnexdIjIS",
          'width': "200",
          'height': "150",
          'location': marker.position.lng()+","+marker.position.lat(),
          'fov':90
      });
      const endpoint = `${url}?${params}`;
      infowindow.setContent('<div id ="pano">' + marker.name + '<img src = '+ endpoint +'/>' + '</div>');
    infowindow.marker = marker;
    // 关闭信息窗口时清空标记属性
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    // 在正确的标记位置打开信息窗口
    infowindow.open(map, marker);
  }
}

// 生成一个地图标记, 参数为颜色
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

// 标记弹跳函数
function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
        marker.setAnimation(null);
    }, 2000);
}

// 显示标记
function showMarkers(m) {
  for (var i = 0; i < m.length; i++) {
    m[i].setMap(map);
  }
}

// 隐藏标记
function hideMarkers(m) {
  for (var i = 0; i < m.length; i++) {
    m[i].setMap(null);
  }
}


var Loc = function (data) {
  this.id = ko.observable(data.id);
  this.name = ko.observable(data.name);
};

var mapErrorHandler = function(){
    window.alert("Google Map 迷路了 ——_- ")
};


var viewModel = function() {
  var self = this;
  self.words = ko.observable("");
  self.markerList = ko.observableArray([]);
  locations.forEach(function (locInfo) {
    self.markerList.push(new Loc(locInfo));
  });

  //更新左侧列表和地图标记
  self.update = function () {
    if(self.words() == ""){
      self.markerList([]);
      locations.forEach(function (locInfo) {
        self.markerList.push(new Loc(locInfo));
      });
      showMarkers(markers);
    }else if(self.words() !== ""){
      hideMarkers(markers);
      var cache = [];
      var mcache = [];
      for(var i = 0, j = locations.length; i < j; i++){
        if(locations[i].name.indexOf(self.words()) != -1){
          cache.push(locations[i]);
          mcache.push(markers[i]);
        }
      }
      self.markerList([]);
      cache.forEach(function (locInfo) {
        self.markerList.push(new Loc(locInfo));
      });
      showMarkers(mcache);
    }
  };

  //点击列表打开对应的infoWindow
  self.openWin = function (clickedList) {
    var mid = clickedList.id();
    populateInfoWindow(markers[mid], largeInfowindow);
    toggleBounce(markers[mid]);
  }
};

ko.applyBindings(new viewModel());
