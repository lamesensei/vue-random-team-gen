var app = new Vue({
  el: "#app",
  data: {
    people: [],
    groups: []
  },
  methods: {
    addPeople() {
      input = document.querySelector("#nameForm");
      if (input.value) {
        this.people.push({
          no: this.people.length + 1,
          text: input.value
        });
      }
      input.value = "";
    },
    removePeople(index) {
      this.people.splice(index, 1);
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
      input = document.querySelector("#groupForm");
      let temp = [];
      let value = input.value || n;
      input.value = "";
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
      let prev = document.querySelector(".bg-light");
      let sabo = document.querySelectorAll(".card")[index];
      if (prev) prev.classList.toggle("bg-light");
      sabo.classList.toggle("bg-light");
    }
  },
  computed: {
    humansCount() {
      return this.people.length;
    },
    groupsCount() {
      return this.groups.length;
    }
  },
  watch: {
    people: {
      handler() {
        localStorage.setItem("people", JSON.stringify(this.people));
      }
    }
  },
  mounted() {
    if (localStorage["people"]) {
      this.people = [...JSON.parse(localStorage["people"])];
    }
  }
});
