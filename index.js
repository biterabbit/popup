window.onload = function () {

  //获取改变大小边缘的父级盒子
  const changebox = document.querySelector('.changebox'),
    //获取弹窗
    bt = document.querySelector('.bt'),
    title = document.querySelector('.title'),
    popup = document.querySelector('.popup'),
    popupBg = document.querySelector('.popup-bg'),
    big = document.querySelector('.big'),
    close = document.querySelector('.close');
  let isDrag = false,//拖动标志
    isResize = false,//改变大小标志
    isBig = false;
  let leftbox, topbox, beforeX, beforeY, beforeHeight, beforeWidth, nowX, nowY, maxLeft, maxTop,
    switchDirection, width, height, top, left, orginal;

  //弹窗按钮
  bt.addEventListener('click', () => {
    popupBg.style.display = 'block'
    popup.style.left = (document.documentElement.clientWidth - popup.offsetWidth) / 2 + 'px'
  })
  //最大化按钮
  big.addEventListener('click', () => {
    if (isBig) {
      //恢复最大化前的位置和大小
      popup.style.top = orginal.top
      popup.style.height = orginal.height
      popup.style.width = orginal.width
      popup.style.left = orginal.left
    } else {
      //储存最大化前的位置和大小
      orginal = {
        left: popup.offsetLeft + 'px',
        top: popup.offsetTop + 'px',
        height: popup.clientHeight + 'px',
        width: popup.clientWidth + 'px'
      }
      popup.style.left = 0;
      popup.style.top = 0;
      popup.style.height = document.documentElement.clientHeight - 2 + 'px'
      popup.style.width = document.documentElement.clientWidth - 2 + 'px'
    }
    isBig = !isBig
    big.innerHTML = isBig ? '-' : 'o'

  })
  //关闭按钮
  close.addEventListener('click', () => {
    popupBg.style.display = 'none'
  })
  //弹窗背景盒子初始化
  popupBg.style.height = document.documentElement.clientHeight + 'px'
  popupBg.style.width = document.documentElement.clientWidth + 'px'

  //鼠标按下选中弹窗标题变为可拖动,同时获取鼠标据弹窗左和上的距离及可拖动的最大距离
  title.addEventListener('mousedown', (e) => {
    e = e || window.event
    maxTop = document.documentElement.clientHeight - popup.offsetHeight
    maxLeft = document.documentElement.clientWidth - popup.offsetWidth
    topbox = e.pageY - popup.offsetTop
    leftbox = e.pageX - popup.offsetLeft
    isDrag = true
  })

  //鼠标松开,变为不可拖动和拖拽改变大小
  document.addEventListener('mouseup', () => {
    isDrag = false
    isResize = false
  })

  //鼠标移动时改变大小或拖动弹窗
  document.addEventListener('mousemove', (e) => {
    e = e || window.event
    //阻止事件默认行为和事件冒泡
    pauseEvent(e)
    //获取鼠标移动时的位置
    nowX = e.pageX
    nowY = e.pageY
    //拖动时
    if (isDrag) {
      left = nowX - leftbox
      top = nowY - topbox
      //弹窗范围限制
      left = left < 0 ? 0 : left;
      top = top < 0 ? 0 : top;
      left = left > maxLeft ? maxLeft : left;
      top = top > maxTop ? maxTop : top;
      //设置弹窗位置
      popup.style.left = left + 'px'
      popup.style.top = top + 'px'
    }
    //改变大小时
    if (isResize) {
      switch (switchDirection) {
        case 'top':
          top = nowY
          height = beforeY - nowY + beforeHeight - topbox
          break;
        case 'left':
          left = nowX
          width = beforeX - nowX + beforeWidth - leftbox
          break;
        case 'bottom':
          height = nowY - beforeY + beforeHeight
          break;
        case 'right':
          width = nowX - beforeX + beforeWidth
          break;
        case 'top-left':
          top = nowY
          left = nowX
          width = beforeX - nowX + beforeWidth - leftbox
          height = beforeY - nowY + beforeHeight - topbox
          break;
        case 'left-bottom':
          left = nowX
          width = beforeX - nowX + beforeWidth - leftbox
          height = nowY - beforeY + beforeHeight
          break;
        case 'bottom-right':
          width = nowX - beforeX + beforeWidth;
          height = nowY - beforeY + beforeHeight;
          break;
        case 'right-top':
          top = nowY
          width = nowX - beforeX + beforeWidth
          height = beforeY - nowY + beforeHeight - topbox
          break;
      }
      //设置最小宽高
      top = top < 0 ? 0 : top;
      left = left < 0 ? 0 : left;
      height = height < 100 ? 100 : height;
      width = width < 100 ? 100 : width;
      //设置最大宽高
      top = top > maxResizeTop ? maxResizeTop : top
      left = left > maxResizeLeft ? maxResizeLeft : left
      height = height > maxResizeHeight ? maxResizeHeight : height
      width = width > maxResizeWidth ? maxResizeWidth : width
      //设置宽高
      popup.style.top = top + 'px'
      popup.style.left = left + 'px'
      popup.style.width = width + 'px'
      popup.style.height = height + 'px'
      //设置拖拽改变弹窗的范围限制
      maxLeft = window.innerWidth - popup.offsetWidth
      maxTop = window.innerHeight - popup.offsetHeight
    }
  })

  // 使用事件代理为边框上的添加监听
  changebox.addEventListener('mousedown', (e) => {
    e = e || window.event
    //获取改变大小前的鼠标位置和弹窗宽高
    if (e.target) {
      beforeX = e.pageX
      beforeY = e.pageY
      beforeHeight = popup.clientHeight
      beforeWidth = popup.clientWidth
      //获取选中方向类名
      switchDirection = e.target.className
      //获取鼠标距离边缘的距离
      leftbox = e.pageX - popup.offsetLeft
      topbox = e.pageY - popup.offsetTop
      //改变大小时的最大范围，50为设置的最小弹窗大小，2为2倍边框宽度
      maxResizeTop = popup.offsetTop + popup.clientHeight - 100
      maxResizeLeft = popup.offsetLeft + popup.clientWidth - 100
      maxResizeHeight = popup.offsetTop + popup.clientHeight - 2
      maxResizeWidth = popup.offsetLeft + popup.clientWidth - 2
      isResize = true
      //根据拖拽不同方向设置不同的最大弹窗大小
      switch (switchDirection) {
        case 'top':
          break;
        case 'left':
          break;
        case 'bottom':
          maxResizeHeight = document.documentElement.clientHeight - popup.offsetTop - 2
          break;
        case 'right':
          maxResizeWidth = document.documentElement.clientWidth - popup.offsetLeft - 2
          break;
        case 'top-left':
          break;
        case 'left-bottom':
          maxResizeHeight = document.documentElement.clientHeight - popup.offsetTop - 2
          break;
        case 'bottom-right':
          maxResizeWidth = document.documentElement.clientWidth - popup.offsetLeft - 2
          maxResizeHeight = document.documentElement.clientHeight - popup.offsetTop - 2
          break;
        case 'right-top':
          maxResizeWidth = document.documentElement.clientWidth - popup.offsetLeft - 2
          break;
      }
    }
  })

  //阻止默认行为和事件冒泡，缺少会导致误触发drag事件，使得mouseup失效
  function pauseEvent(e) {
    if (e.preventDefault) e.preventDefault()
    if (e.stopPropagation) e.stopPropagation()
    e.cancelBubble = true
    e.returnValue = false;
    return false
  }
}