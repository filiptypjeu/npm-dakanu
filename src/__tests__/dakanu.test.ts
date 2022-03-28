import DakaNu from "../index";
import env from "./variables/dakanu.test_variables";

const daka = new DakaNu(env);

export const testItems = (items: any[]) => {
  expect(items[0].title).toEqual("Parent Directory");
  items.forEach(item => {
    expect(item.title).toBeDefined();
    expect(item.path).toBeDefined();
    expect(item.isFile).toBeDefined();
  });
};

test("search all files", async () => {
  const a = await daka.files();
  testItems(a);
  expect(a.slice(0, 20)).toHaveLength(20);
  expect(a[1]).toEqual({
    title: "1G3B/",
    path: "/files/1G3B/",
    isFile: false,
  });
  expect(a[a.length - 1]).toEqual({
    title: "WebOodi  Etusivu.mp3",
    path: "/files/WebOodi%20%20Etusivu.mp3",
    isFile: true,
  });

  const megadeth = a.filter(item => item.title === "Megadeth-13.EvIlHaVoC/")[0];
  expect(megadeth).toBeDefined();
  expect(megadeth.isFile).toBeFalsy();
}, 10000);

test("search all sounds", async () => {
  const a = await daka.sounds();
  testItems(a);
  expect(a.slice(0, 10)).toHaveLength(10);
  expect(a[1]).toEqual({
    title: "Amfilla Tavataan/",
    path: "/soundboard/sounds/Amfilla%20Tavataan/",
    isFile: false,
  });
  expect(a[a.length - 1]).toEqual({
    title: "Voi helvetin perse kaikki menee päin vittua saatana!.mp3",
    path: "/soundboard/sounds/Voi%20helvetin%20perse%20kaikki%20menee%20p%c3%a4in%20vittua%20saatana!.mp3",
    isFile: true,
  });
}, 10000);

test("search priestess", async () => {
  const a = await daka.search("/files/Priestess/");
  expect(a).toEqual([
    {
      title: "Parent Directory",
      path: "/files/",
      isFile: false,
    },
    {
      title: "Priestess -2009- Prior To The Fire/",
      path: "/files/Priestess/Priestess%20-2009-%20Prior%20To%20The%20Fire/",
      isFile: false,
    },
    {
      title: "Priestess - Hello Master/",
      path: "/files/Priestess/Priestess%20-%20Hello%20Master/",
      isFile: false,
    },
  ]);
}, 10000);

test("search cob", async () => {
  const a = await daka.search("/files/Children%20Of%20Bodom/(1997)%20-%20Something%20Wild/");
  expect(a).toEqual([
    {
      title: "Parent Directory",
      path: "/files/Children%20Of%20Bodom/",
      isFile: false,
    },
    {
      title: "01 Deadnight Warrior.mp3",
      path: "/files/Children%20Of%20Bodom/(1997)%20-%20Something%20Wild/01%20Deadnight%20Warrior.mp3",
      isFile: true,
    },
    {
      title: "02 In The Shadows.mp3",
      path: "/files/Children%20Of%20Bodom/(1997)%20-%20Something%20Wild/02%20In%20The%20Shadows.mp3",
      isFile: true,
    },
    {
      title: "03 Red Light In My Eyes, Pt I.mp3",
      path: "/files/Children%20Of%20Bodom/(1997)%20-%20Something%20Wild/03%20Red%20Light%20In%20My%20Eyes,%20Pt%20I.mp3",
      isFile: true,
    },
    {
      title: "04 Red Light In My Eyes, Pt II.mp3",
      path: "/files/Children%20Of%20Bodom/(1997)%20-%20Something%20Wild/04%20Red%20Light%20In%20My%20Eyes,%20Pt%20II.mp3",
      isFile: true,
    },
    {
      title: "05 Lake Bodom.mp3",
      path: "/files/Children%20Of%20Bodom/(1997)%20-%20Something%20Wild/05%20Lake%20Bodom.mp3",
      isFile: true,
    },
    {
      title: "06 The Nail.mp3",
      path: "/files/Children%20Of%20Bodom/(1997)%20-%20Something%20Wild/06%20The%20Nail.mp3",
      isFile: true,
    },
    {
      title: "07 Touch Like Angel Of Death.mp3",
      path: "/files/Children%20Of%20Bodom/(1997)%20-%20Something%20Wild/07%20Touch%20Like%20Angel%20Of%20Death.mp3",
      isFile: true,
    },
  ]);
}, 10000);

test("search file", async () => {
  const a = await daka.search("/files/Gr%C3%A5trunk.mp3");
  expect(a).toEqual([]);
}, 10000);
