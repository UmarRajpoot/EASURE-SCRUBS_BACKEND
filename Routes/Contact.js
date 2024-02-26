import express from "express";
import Contacts from "../Controllers/Contact.js";
const router = express.Router();

router.post("/Contacts", Contacts.addContactInfo);
router.delete("/Contacts", Contacts.deleteContact);
router.get("/Contacts", Contacts.getallContacts);

export default router;
