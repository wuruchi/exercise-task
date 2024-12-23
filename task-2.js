/** Original */
// This function lacks the next parameter, which is necessary to pass the error (if thrown) to the next middleware
exports.inviteUser = function (req, res) {
    var invitationBody = req.body; // Let's assume this body has been properly validated
    var shopId = req.params.shopId;
    var authUrl = "https://url.to.auth.system.com/invitation";
    superagent
        .post(authUrl)
        .send(invitationBody)
        .end(function (err, invitationResponse) {
            // This function is assuming too many responsibilities: Handler User, Handle Shop, Handle Response Codes, Error Handling
            // What if the request resulted in an error?
            // What if the status is neither 201 nor 200?
            // What if the status is an error status?
            // Let's assume there is a proper error handler middleware set up in this express API
            // Then, we need to validate the correctness of the response and throw an error if necessary
            // that we will then pass to the next middleware, the error handler
            if (invitationResponse.status === 201) {
                // There is a mix of parameters from request, response and invitationResponse.
                // Some of these apply to the User model, some to the Shop model.
                // We should clarify that context on the refactor.
                User.findOneAndUpdate(
                    {
                        authId: invitationResponse.body.authId,
                    },
                    {
                        authId: invitationResponse.body.authId,
                        email: invitationBody.email,
                    },
                    {
                        upsert: true,
                        new: true,
                    },
                    function (err, createdUser) {
                        Shop.findById(shopId).exec(function (err, shop) {
                            if (err || !shop) {
                                return res
                                    .status(500)
                                    .send(err || { message: "No shop found" });
                            }
                            if (
                                shop.invitations.indexOf(
                                    invitationResponse.body.invitationId // I guess we should validate if the invitationId is not present in the shop
                                )
                            ) {
                                shop.invitations.push(
                                    invitationResponse.body.invitationId
                                ); // Let's assume invitations only saves Ids while users saves the whole user object
                            }
                            if (shop.users.indexOf(createdUser._id) === -1) {
                                shop.users.push(createdUser);
                            }
                            shop.save(); // Let's only save if there are changes in the shop
                        });
                    }
                );
            } else if (invitationResponse.status === 200) {
                // Invitation already existed
                // Let's handle this scenario on its own class or function
                res.status(400).json({
                    error: true,
                    message: "User already invited to this shop",
                });
                return;
            }
            res.json(invitationResponse);
        });
};

/** Refactored */

// Let's assume the error handler middleware knows how to handle the errors thrown by the following classes
class InvitationResponseValidator {
    constructor(invitationResponse) {
        this.invitationsResponse = invitationResponse;
    }

    onErrorStatus() {
        if (
            this.invitationsResponse.status !== 201 &&
            this.invitationsResponse.status !== 200
        ) {
            throw InternalServerError(
                "Unexpected status code when handling invitation",
                this.invitationsResponse
            );
        }
        return;
    }

    onUserAlreadyCreated() {
        if (this.invitationsResponse.status === 200) {
            throw BadRequestError("User already invited to this shop");
        }
        return;
    }

    validate() {
        this.onErrorStatus();
        this.onUserAlreadyCreated();
    }
}

/**
 * General Purpose User Handler
 */
class UserHandler {
    constructor(userModel) {
        this.userModel = userModel;
    }

    /**
     *
     * @param {*} authId
     * @param {*} email
     * @returns - A registered user
     */
    async createOrUpdateUser(authId, email) {
        return await this.userModel.findOneAndUpdate(
            {
                authId,
            },
            {
                authId,
                email,
            },
            {
                upsert: true,
                new: true,
            }
        );
    }
}

/**
 * General Purpose Shop Handler
 */
class ShopHandler {
    constructor(shopModel) {
        this.shopModel = shopModel;
    }

    async getShop(shopId) {
        try {
            const shop = await this.shopModel.findById(shopId);
            if (!shop) {
                throw NotFoundError("Shop not found");
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err;
            }
            throw InternalServerError("Error while retrieving shop", err);
        }
    }

    async addInvitationIfNotExists(shop, invitationId) {
        if (shop.invitations.indexOf(invitationId) === -1) {
            shop.invitations.push(invitationId);
            await shop.save();
        }
        return shop;
    }

    async addUserIfNotExists(shop, registeredUser) {
        if (shop.users.indexOf(registeredUser._id) === -1) {
            shop.users.push(registeredUser);
            await shop.save();
        }
        return shop;
    }
}

exports.inviteUser = async (req, res, next) => {
    var invitationBody = req.body; // Let's assume this body has been properly validated
    const { email } = invitationBody;
    var shopId = req.params.shopId;
    var authUrl = "https://url.to.auth.system.com/invitation";
    try {
        const invitationResponse = await superagent.post(authUrl).send(invitationBody);
        const { authId, invitationId } = invitationResponse.body;

        (new InvitationResponseValidator(invitationResponse)).validate();

        const registeredUser = await (new UserHandler(User)).createOrUpdateUser(authId, email);
        const shopHandler = new ShopHandler(Shop);
        const shop = await shopHandler.getShop(shopId);
        await Promise.all([
            shopHandler.addInvitationIfNotExists(shop, invitationId),
            shopHandler.addUserIfNotExists(shop, registeredUser),
        ]);
        res.json(invitationResponse);
        next();
    } catch (err) {
        next(err);
    }
};
