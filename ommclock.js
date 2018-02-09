      function ommClock(el, opts) {
        this.container = el;
        this.run = false;
        this.svg = null;
        this.startTime = null;
        this.defaults = {
          class: 'clock',
          duration: 60000,
          hours: [12,1,2,3,4,5,6,7,8,9,10,11],
          height: 500,
          width: 500,
          caption: '',
          onUpdate: function() {}
        };
        function extend(a, b){
          for(var key in b)
            if(b.hasOwnProperty(key))
              a[key] = b[key];
          return a;
        }
        this.options = extend(this.defaults, opts);
        this.init = () => {
          this.center = this.options.center ? this.options.center : { x: 50, y: 50 };
          this.svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
          this.svg.setAttribute('width', this.options.width);
          this.svg.setAttribute('viewBox', '0 0 100 100');
          this.svg.setAttribute('class', 'clock');
          this.container.appendChild(this.svg);

          this.hands = document.createElementNS("http://www.w3.org/2000/svg", 'g');
          this.hands.setAttribute('class', 'hands');
          this.svg.appendChild(this.hands);

          let minutehand = document.createElementNS("http://www.w3.org/2000/svg", 'path');
          minutehand.setAttribute('class', 'minutehand');
          minutehand.setAttribute('d', "M 49.724866,15.263659 48.598078,41.062511 C 48.580052,41.576324 48.985683,42 49.499497,42 h 1.000581 c 0.513814,0 0.919463,-0.423676 0.901439,-0.937489 L 50.265706,15.263659 c -0.01797,-0.351545 -0.522814,-0.351545 -0.54084,0");

          let hourhand = document.createElementNS("http://www.w3.org/2000/svg", 'path');
          hourhand.setAttribute('class', 'hourhand');
          hourhand.setAttribute('d', "M 49.59903,21.118276 48.004904,40.577143 C 47.939034,41.34127 48.545063,42 49.322364,42 h 1.356982 c 0.764126,0 1.370158,-0.65873 1.31746,-1.422857 L 50.389505,21.118276 c -0.03952,-0.474287 -0.750951,-0.474287 -0.790475,0");

          this.hands.appendChild(hourhand);
          this.hands.appendChild(minutehand);

          this.caption = document.createElementNS("http://www.w3.org/2000/svg", 'text');
          this.caption.setAttribute('class', 'caption');
          this.caption.setAttribute('x', '50');
          this.caption.setAttribute('y', '50');
          this.caption.innerHTML = this.options.caption;
          this.svg.appendChild(this.caption);
          
          this.numbers = document.createElementNS("http://www.w3.org/2000/svg", 'g');
          this.numbers.setAttribute('class', 'numbers');
          this.svg.appendChild(this.numbers);

          this.options.hours.forEach((h,i) => {
            let theta = i * 2 * Math.PI / 12,
              x = 50 * Math.sin(theta) + this.center.x,
              y =  - 50 * Math.cos(theta) + this.center.y;
            let t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            t.setAttribute('x', x);
            t.setAttribute('y', y);
            t.innerHTML = h;
            let rotate = theta > 0 ? (theta / Math.PI  * 180) % 180 - 90 : 0;
            t.setAttribute("transform", "rotate(" + rotate + ","+x+","+y+")");
            if(i === 0) {
              t.style['text-anchor'] = 'middle';
              t.setAttribute('transform', 'translate(0, 5)');
            }
            else if(i<6) {
              t.style['text-anchor'] = 'end';
            }
            else {
              t.style['text-anchor'] = 'start';
            }
            this.numbers.appendChild(t);
          });
        }

        this.start = () => {
          this.startTime = new Date().getTime();
          this.run = 1;
          this.tick();
        }

        this.stop = () => {
          this.run = 0;
        }

        this.tick = () => {
          let duration = new Date().getTime() - this.startTime;
          let angle = 360 * duration / this.options.duration;
          this.svg.querySelector('.minutehand').setAttribute("transform", "rotate(" + angle + ",50,50)");
          this.options.onUpdate.call(this, angle);
          this.caption.style.opacity = angle / 10;
          window.requestAnimationFrame(this.tick);
        }
      }
      if(typeof window.jQuery !== 'undefined') {
        jQuery.fn.extend({
          clockify: function(options) {
            return this.each(function() {
              let c = new ommClock(this, options);
              c.init();
              c.start();
              return c;
            });
          }
        });
      }
