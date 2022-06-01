import test from "ava";
import { Tajriba, TajribaAdmin, TajribaParticipant } from "../dist/module.mjs";

const url = "http://localhost:4737/query";

test("admin login", async (t) => {
  const taj = await Tajriba.create(url);
  // t.log(taj);
  t.truthy(taj instanceof Tajriba);

  const [tajAdmin, sessionToken] = await taj.login("username", "password");
  // t.log(tajAdmin);
  t.truthy(tajAdmin instanceof TajribaAdmin);
  t.truthy(sessionToken);

  const tajAdmin2 = await taj.sessionAdmin(sessionToken);
  // t.log(tajAdmin2);
  t.truthy(tajAdmin2 instanceof TajribaAdmin);

  tajAdmin2.stop();
  tajAdmin.stop();
  taj.stop();
});

test("participant registation", async (t) => {
  const taj = await Tajriba.create(url);
  // t.log(taj);
  t.truthy(taj instanceof Tajriba);

  const [tajParticipant, sessionToken] = await taj.registerParticipant("hello");
  // t.log(tajParticipant);
  t.truthy(tajParticipant instanceof TajribaParticipant);
  t.truthy(sessionToken);

  const tajParticipant2 = await taj.sessionParticipant(sessionToken, {});
  // t.log(tajParticipant2);
  t.truthy(tajParticipant2 instanceof TajribaParticipant);

  tajParticipant2.stop();
  tajParticipant.stop();
  taj.stop();
});

test("service registation", async (t) => {
  const taj = await Tajriba.create(url);
  // t.log(taj);
  t.truthy(taj instanceof Tajriba);

  const [tajService, sessionToken] = await taj.registerService(
    "myservice",
    "0123456789123456"
  );
  // t.log(tajService);
  t.truthy(tajService instanceof TajribaAdmin);
  t.truthy(sessionToken);

  const tajService2 = await taj.sessionAdmin(sessionToken);
  // t.log(tajService2);
  t.truthy(tajService2 instanceof TajribaAdmin);

  tajService2.stop();
  tajService.stop();
  taj.stop();
});
