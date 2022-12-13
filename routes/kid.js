const express = require("express")

const {
    login,
    register,
} = require("../controllers/game/kid/KidAuthController.js")
const kid = require("../controllers/game/kid/KidController.js")

const {
    list,
    addFriend,
    approve,
    getPending,
    request,
    search,
} = require("../controllers/game/kid/KidFriendsController")

const {
    storePet,
    updatePet,
} = require("../controllers/game/kid/KidPetController")

const {
    loadKidInventory,
    postKidInventory,
} = require("../controllers/game/kid/KidInventoryController.js")

const verifyParentToken = require("../middleware/verifyParentToken.js")
const verifyKidToken = require("../middleware/verifyKidToken.js")
const kidRegisterValidator = require("../validator/kidRegisterValidator.js")
const kidInventoryValidator = require("../validator/kidInventoryValidator.js")
const kidPetValidator = require("../validator/kidPetValidator.js")

const router = express.Router()

router.post("/login", login)
router.post("/register", verifyParentToken, kidRegisterValidator, register)
router.get("/profile", verifyKidToken, kid.profile)
router.post("/update", verifyKidToken, kid.updateProfile)

router.get("/friend/list", verifyKidToken, list)
router.post("/friend/add", verifyKidToken, addFriend)
router.post("/friend/approve", verifyKidToken, approve)
router.get("/friend/pending_approve", verifyKidToken, getPending)
router.get("/friend/request", verifyKidToken, request)
router.post("/friend/search", verifyKidToken, search)

router.post("/pet", verifyKidToken, kidPetValidator, storePet)
router.post("/pet/:uuid", verifyKidToken, updatePet)

// kid inventory
router.get("/inventory", verifyKidToken, loadKidInventory)
router.post(
    "/inventory",
    verifyKidToken,
    kidInventoryValidator,
    postKidInventory
)

module.exports = router
