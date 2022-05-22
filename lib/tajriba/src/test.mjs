import test from "ava";
import { Tajriba } from "../dist/module.mjs";

const url = "http://localhost:4737/query";

test("admin login", async (t) => {
  const taj = new Tajriba(url);
  t.truthy(taj);

  const [tajAdmin, sessionToken] = await taj.login("username", "password");
  t.truthy(tajAdmin);
  t.truthy(sessionToken);

  const tajAdmin2 = await Tajriba.sessionAdmin(url, sessionToken);
  t.log(tajAdmin2);
  t.truthy(tajAdmin2);

  tajAdmin.stop();
  taj.stop();
});
