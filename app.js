var app = new Vue({
  el: "#app",
  data: {
    people: [],
    bench: [],
    groups: [],
    peepShow: true,
    customGroup: undefined,
    splitInto: "",
    splitOption: false
  },
  methods: {
    addPeople(e, peep) {
      let input = document.querySelector("#nameForm");
      let value = peep || input.value;
      if (value) {
        this.people.push({
          no: this.people.length + 1,
          text: value
        });
      }
      input.value = "";
    },
    removePeople(index) {
      this.bench.splice(index, 1);
    },
    benchPeople(index) {
      this.bench.push(this.people[index]);
      this.people.splice(index, 1);
    },
    returnFromBench(index) {
      this.people.push(this.bench[index]);
      this.bench.splice(index, 1);
    },
    shuffle() {
      for (group of this.groups) {
        group.members = [];
      }

      if (this.groups.length > 0) {
        let mirror = [...this.people];
        let max = this.people.length;
        let swap, rand;

        while (max !== 0) {
          rand = Math.floor(Math.random() * max);
          max--;

          swap = mirror[max];
          mirror[max] = mirror[rand];
          mirror[rand] = swap;
        }

        let turn = 0;
        let limit = this.groups.length - 1;
        while (mirror.length > 0) {
          if (turn > limit) turn = 0;
          this.groups[turn].members.push(mirror.shift());
          turn++;
        }
      }
    },
    addGroups(n) {
      let temp = [];
      let value = n;
      if (value) {
        let i = 1;
        while (i <= value) {
          let group = {
            name: i,
            members: []
          };
          temp.push(group);
          i++;
        }
        return (this.groups = [...temp]);
      }
    },
    split(n) {
      for (group of this.groups) {
        group.members = [];
      }
      if (n == "all") this.addGroups(this.people.length);
      let modifier = this.people.length;
      if (modifier % 2 !== 0) modifier++;
      this.addGroups(Math.floor(modifier / n));
      this.shuffle();
    },
    arrow() {
      let index = Math.floor(Math.random() * this.groups.length);
      let prev = document.querySelector(".bg-warning");
      let sabo = document.querySelectorAll(".card")[index];
      if (prev) prev.classList.toggle("bg-warning");
      sabo.classList.toggle("bg-warning");
    },
    togglePeeps() {
      this.peepShow ? (this.peepShow = false) : (this.peepShow = true);
    }
  },
  computed: {
    humansCount() {
      return this.people.length;
    },
    groupsCount() {
      return this.groups.length;
    },
    benchCount() {
      return this.bench.length;
    }
  },
  watch: {
    people: {
      handler() {
        localStorage.setItem("people", JSON.stringify(this.people));
        if (this.people.length > 0) {
          let queryString = "?people=";
          for (peep of this.people) {
            queryString += peep.text;
            queryString += "+";
          }
          queryString = queryString.slice(0, queryString.length - 1);
          let currentUrl = window.location.href;
          let queryStringPos = window.location.href.indexOf(
            window.location.search
          );
          let sexyUrl = currentUrl.slice(0, queryStringPos) + queryString;
          window.history.replaceState({}, "", sexyUrl);
        }
      }
    },
    bench: {
      handler() {
        localStorage.setItem("bench", JSON.stringify(this.bench));
      }
    },
    groups: {
      handler() {
        localStorage.setItem("groups", JSON.stringify(this.groups));
      }
    },
    customGroup: {
      handler() {
        if (this.customGroup.length > 0) {
          let n = this.customGroup.slice(0, 2);
          this.addGroups(n);
          this.shuffle();
        } else {
          this.groups = [];
        }
      }
    },
    splitInto: {
      handler() {
        if (this.splitInto != "") {
          this.split(this.splitInto);
        }
      }
    }
  },
  mounted() {
    if (window.location.search.includes("people")) {
      let queryString = window.location.search.slice(8).split("+");
      for (peep of queryString) {
        peep = decodeURI(peep);
        this.addPeople(0, peep);
      }
    } else if (localStorage["people"]) {
      this.people = [...JSON.parse(localStorage["people"])];
    }

    if (localStorage["bench"])
      this.bench = [...JSON.parse(localStorage["bench"])];
    if (localStorage["groups"])
      this.groups = [...JSON.parse(localStorage["groups"])];
  }
});
