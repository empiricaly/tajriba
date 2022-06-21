import test from "ava";
import { Tajriba, TajribaAdmin, TajribaParticipant } from "../dist/module.mjs";

const url = "http://localhost:4737/query";

test("admin login", async (t) => {
  const taj = await Tajriba.create(url);

  t.truthy(taj instanceof Tajriba);

  const sessionToken = await taj.login("username", "password");

  t.truthy(sessionToken);

  const tajAdmin = await taj.sessionAdmin(sessionToken);

  t.truthy(tajAdmin instanceof TajribaAdmin);

  tajAdmin.stop();
  taj.stop();
});

test("participant registation", async (t) => {
  const taj = await Tajriba.create(url);

  t.truthy(taj instanceof Tajriba);

  const [sessionToken, participant] = await taj.registerParticipant("hello");

  t.truthy(sessionToken);

  const tajParticipant = await taj.sessionParticipant(
    sessionToken,
    participant
  );
  t.truthy(tajParticipant instanceof TajribaParticipant);

  tajParticipant.stop();
  taj.stop();
});

test("service registation", async (t) => {
  const taj = await Tajriba.create(url);

  t.truthy(taj instanceof Tajriba);

  const sessionToken = await taj.registerService(
    "myservice",
    "0123456789123456"
  );

  t.truthy(sessionToken);

  const tajService = await taj.sessionAdmin(sessionToken);
  t.truthy(tajService instanceof TajribaAdmin);

  tajService.stop();
  taj.stop();
});
