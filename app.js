var app = new Vue({
  el: "#app",
  data: {
    people: [],
    prePeople: [],
    bench: [],
    groups: [],
    peepShow: true,
    customGroup: undefined,
    splitInto: "2",
    customGroupOption: false
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
    shuffle(stuff) {
      let mirror = [...stuff];
      let max = stuff.length;
      let swap, rand;

      while (max !== 0) {
        rand = Math.floor(Math.random() * max);
        max--;

        swap = mirror[max];
        mirror[max] = mirror[rand];
        mirror[rand] = swap;
      }

      return mirror;
    },
    fillGroups(peeps) {
      let turn = 0;
      let end = this.groups.length - 1;
      let limit =
        this.humansCount % (this.splitInto != "2" ? 1 : this.splitInto);

      if (this.customGroupOption) limit = 0;

      while (peeps.length > limit) {
        if (turn > end) turn = 0;
        this.groups[turn].members.push(peeps.shift());
        turn++;
      }

      if (peeps.length > 0) {
        this.addGroup();
        while (peeps.length > 0) {
          this.groups[this.groups.length - 1].members.push(peeps.shift());
        }
      }
    },
    addGroup() {
      this.groups.push({
        name: this.groups[this.groups.length - 1].name + 1,
        members: []
      });
    },
    makeGroups(n) {
      let temp = [];
      let i = 1;

      while (i <= n) {
        let group = {
          name: i,
          members: []
        };
        temp.push(group);
        i++;
      }
      return (this.groups = [...temp]);
    },
    split() {
      this.clearGroups();

      let modifier = this.people.length;
      let split = this.splitInto == "all" ? 1 : Number(this.splitInto);
      this.makeGroups(Math.floor(modifier / split));
      this.prePeople = [...this.people];
      this.fillGroups(this.shuffle(this.people));
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
    },
    fill() {
      let newPeople = [];
      this.people.forEach(person => {
        if (!this.prePeople.includes(person)) newPeople.push(person);
      });
      newPeople = this.shuffle(newPeople);
      while (newPeople.length > 0) {
        if (
          this.groups[this.groups.length - 1].members.length <
          (this.splitInto == "all" ? 1 : Number(this.splitInto))
        ) {
          this.groups[this.groups.length - 1].members.push(newPeople.shift());
        } else {
          this.addGroup();
        }
      }
      this.prePeople = [...this.people];
    },
    clearGroups() {
      for (group of this.groups) {
        group.members = [];
      }
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
    },
    sortedPeople() {
      return this.people.sort((a, b) =>
        a.text > b.text ? 1 : b.text > a.text ? -1 : 0
      );
    },
    sortedBench() {
      return this.bench.sort((a, b) =>
        a.text > b.text ? 1 : b.text > a.text ? -1 : 0
      );
    },
    prePeopleCount() {
      return this.prePeople.length;
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
        localStorage.setItem("splitInto", this.splitInto);
      }
    },
    customGroup: {
      handler() {
        if (this.customGroup.length > 0) {
          let n = this.customGroup.slice(0, 2);
          this.makeGroups(n);
          this.prePeople = [...this.people];
          this.fillGroups(this.shuffle(this.people));
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
      this.prePeople = [...this.people];
    } else if (localStorage["people"]) {
      this.people = [...JSON.parse(localStorage["people"])];
    }

    if (localStorage["bench"])
      this.bench = [...JSON.parse(localStorage["bench"])];
    if (localStorage["groups"])
      this.groups = [...JSON.parse(localStorage["groups"])];
    if (localStorage["splitInto"]) this.splitInto = localStorage["splitInto"];
  }
});
