class c_slide {
    constructor(options){
        this.slide = document.querySelector(options.container);
        this.slideItem = this.slide.querySelectorAll('.slide-item');
        this.totalNum = this.slideItem.length;
        this.isLoading = true;
        this.isSliding = false;
        this.currentIndex = 0;
        this.pager = document.querySelector(options.pager);
        this.control = document.querySelector(options.control) || '';
        this.auto= options.auto || false;
        this.autoBtn;
        this.autoPlayInstence;
        this.autoStatus;
        this.autoSpeed = options.autoSpeed || 5000;
        
        //set data-attribute for pager & control
        this.pagerInit();
        this.controlInit();
        //set initial data
        this.slideItem[0].classList.add('active');

        //loading done
        this.isLoading = false;

        //set pager 0 
        this.pagerChange(0);

        //autoplay start

        this.autoPlayInstence = setInterval(this.autoPlay.bind(this), this.autoSpeed);

        //eventlistener
        this.control.addEventListener('click', this.controlAction);
        this.pager.addEventListener('click', this.pagerAction);
        this.slide.addEventListener('click', this.slideAction);
        this.slide.addEventListener('mouseover', this.cursorChange);
        this.slide.addEventListener('mousemove', this.cursorChange);
        this.slide.addEventListener('mouseleave', this.cursorChange);
    }

    pagerInit(){
        var items = this.pager.querySelectorAll('li')
        for(let i=0; i < items.length; i++){
            var targetItems = items[i].querySelector('a');
            targetItems.setAttribute('data-pager', i)
        }
    }

    controlInit(){

        if(this.control){
            const prevBtn = this.control.querySelector('.prev')
            const nextBtn = this.control.querySelector('.next')
            prevBtn.setAttribute('data-control', 'prev')
            nextBtn.setAttribute('data-control', 'next')
            
        }

        if(this.auto){
            this.autoBtn = this.control.querySelector('.auto')
            this.autoBtn .setAttribute('data-control', 'auto')
            this.autoBtn .setAttribute('data-auto', 'stop')  
        }
        
             
    }

    pagerChange(index){
        const item = this.pager.querySelectorAll('li');
    
        for(let i = 0; i < item.length; i++){
            item[i].querySelector('a').classList.remove('active');
        }

        item[index].querySelector('a').classList.add('active');
    }

    pagerAction = (e) => {
        e.preventDefault();
        if(this.isSliding) return;
        var targetNum = e.target.getAttribute('data-pager');

        if(!targetNum) return;
        
        this.stopAutoPlay();   
        this.increaseSlide(targetNum);
    }

    controlAction = (e) => {
        e.preventDefault();
        if(this.isSliding) return;

        let dir = e.target.getAttribute('data-control');
        if(!dir) return;

        switch(dir){
            case 'next':        
                this.stopAutoPlay();         
                this.increaseSlide();
                break;

            case 'prev':
                this.stopAutoPlay();  
                this.decreaseSlide();   
                break;  
            case 'auto':
                this.autoStatus = this.autoBtn.getAttribute('data-auto');

                if(this.autoStatus == 'stop'){
                    this.autoBtn.setAttribute('data-auto', 'play');
                    this.autoBtn.innerHTML = "play";
                    if(this.autoPlayInstence != null){
                       clearInterval(this.autoPlayInstence);
                    }
    
                }else{
                    this.autoBtn.setAttribute('data-auto','stop');
                    this.autoBtn.innerHTML = "stop";
                    this.autoPlayInstence = setInterval(this.autoPlay.bind(this), this.autoSpeed);
                }

        }
        

    }

    increaseSlide(targetIndex){
        
        this.isSliding = true;    
        
        for(let i = 0; i < this.slideItem.length; i++){
            this.slideItem[i].classList.remove('hide')
            this.slideItem[i].classList.remove('active')
            this.slideItem[i].classList.remove('show')
        }
    
        let hideNum;
        let activeNum; 
    
        if(targetIndex){
          
            activeNum = targetIndex;
            hideNum = this.currentIndex;  

            this.slideItem[hideNum].classList.add('hide');
            this.slideItem[activeNum].classList.add('active');

            this.currentIndex = targetIndex;
    
        }else{
            if(this.currentIndex < this.totalNum -1){
           
                this.currentIndex++;
        
                hideNum = this.currentIndex - 1;
                activeNum = this.currentIndex;
        
            }else{
        
                this.currentIndex = 0;
                hideNum = this.totalNum - 1;
                activeNum = this.currentIndex
            }
        
            this.slideItem[hideNum].classList.add('hide');
            this.slideItem[activeNum].classList.add('active');
        }
        
        this.pagerChange(this.currentIndex);

        setTimeout((function(){
            this.isSliding = false;   
            
        }).bind(this),1000)
    
        
    }

    decreaseSlide(){
        this.isSliding = true;    
        
        for(let i = 0; i < this.slideItem.length; i++){
            this.slideItem[i].classList.remove('hide')
            this.slideItem[i].classList.remove('active')
            this.slideItem[i].classList.remove('show')
        }
    
        let showNum;
        let tempNum;
    
        if(this.currentIndex <= 0){               
            this.currentIndex = this.totalNum - 1;
            showNum = this.currentIndex;
            tempNum = 0
    
        }else{                
            this.currentIndex--
            showNum = this.currentIndex;
            tempNum = this.currentIndex + 1;
        }            
    
        this.slideItem[showNum].classList.add('show');
        this.slideItem[tempNum].classList.add('active');
    
        this.pagerChange(this.currentIndex);
    
        setTimeout((function(){
            this.slideItem[showNum].classList.add('active'); 
            this.slideItem[tempNum].classList.remove('active'); 
        }).bind(this), 900)
    
        setTimeout((function(){
            this.isSliding = false;    
        }).bind(this),1000)
    
    
        
    }

    slideAction = (e) => {

        if(this.isSliding) return;

        this.stopAutoPlay();
    
        if(e.clientX < this.slide.offsetWidth / 2 && e.clientY < this.slide.offsetHeight){
            this.decreaseSlide();
        }
    
        if(e.clientX >= this.slide.offsetWidth / 2 && e.clientY < this.slide.offsetHeight){
            this.increaseSlide()
        }
    }

    cursorChange = (e) => {
        this.slide.classList.remove('arrow-left');
        this.slide.classList.remove('arrow-right');
        if(e.clientX < this.slide.offsetWidth / 2 && e.clientY < this.slide.offsetHeight){
            this.slide.classList.add('arrow-left')
        }

        if(e.clientX >= this.slide.offsetWidth / 2 && e.clientY < this.slide.offsetHeight){
            this.slide.classList.add('arrow-right')
        }
    }

    autoPlay(){
        this.increaseSlide();
    }

    stopAutoPlay(){
        clearInterval(this.autoPlayInstence);
        this.autoBtn.setAttribute('data-auto', 'play');
        this.autoBtn.innerHTML = "play";
    }

}

var slide = new c_slide({
    container : '.sec_01 .c-slider',
    pager : '.sec_01 .slide-pager',
    control : '.sec_01 .control-wrapper',
    auto : true
});

var small_slide = new c_slide({
    container : '.sec_02 .c-slider',
    pager : '.sec_02 .slide-pager',
    control : '.sec_02 .control-wrapper',
    auto : true,
    autoSpeed : 3000
});

