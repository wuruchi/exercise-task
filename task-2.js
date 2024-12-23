/** Original */
exports.inviteUser = function (req, res) {
    var invitationBody = req.body; // Let's assume this body has been properly validated
    var shopId = req.params.shopId;
    var authUrl = "https://url.to.auth.system.com/invitation";
    superagent
        .post(authUrl)
        .send(invitationBody)
        .end(function (err, invitationResponse) {
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
                                    invitationResponse.body.invitationId
                                )
                            ) {
                                shop.invitations.push(
                                    invitationResponse.body.invitationId
                                );
                            }
                            if (shop.users.indexOf(createdUser._id) === -1) {
                                shop.users.push(createdUser);
                            }
                            shop.save();
                        });
                    }
                );
            } else if (invitationResponse.status === 200) {
                // Invitation already existed
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
    constructor(err, invitationResponse) {
        this.err = err;
        this.invitationsResponse = invitationResponse;
    }

    onRequestError() {
        if (this.err) {
            throw InternalServerError(
                "Error while creating invitation",
                this.err
            )
        }
        return;
    }

    onErrorStatus() {
        if (this.invitationsResponse.status !== 201 && this.invitationsResponse.status !== 200) {
            throw InternalServerError(
                "Unexpected status code when handling invitation",
                this.invitationsResponse
            )
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
        this.onRequestError();
        this.onErrorStatus();
        this.onUserAlreadyCreated();
    }
}

class InvitationResponseHandler {
    constructor(shopModel, userModel) {
        this.shopModel = shopModel;
        this.userModel = userModel;
    }


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
            });
    }

    async onInvitationCreatedUpdateShop({ authId, email }, { invitationId, shopId }) {
        const registeredUser = await this.createOrUpdateUser(authId, email);
        let shop;
        try {
            shop = await this.shopModel.findById(shopId);
            if (!shop) {
                throw new Error("No shop found");
            }
        } catch (err) {
            throw InternalServerError("Error while updating shop", err);
        }
        if (shop.invitations.indexOf(invitationId)) {
            shop.invitations.push(invitationId);
        }
        if (shop.users.indexOf(registeredUser._id) === -1) {
            shop.users.push(registeredUser);
        }
        await shop.save();
        return shop;
    }

}

exports.inviteUser = function (req, res, next) {
    var invitationBody = req.body; // Let's assume this body has been properly validated
    var shopId = req.params.shopId;
    var authUrl = "https://url.to.auth.system.com/invitation";
    superagent
        .post(authUrl)
        .send(invitationBody)
        .end(function (err, invitationResponse) {
            try {
                (new InvitationResponseValidator(err, invitationResponse)).validate();
            } catch (err) {
                next(err);
            }
            (async () => {
                const invitationResponseHandler = new InvitationResponseHandler(Shop, User);
                await invitationResponseHandler.onInvitationCreatedUpdateShop(invitationResponse.body, { invitationId: invitationResponse.body.invitationId, shopId });
            })().catch(next);
        });
};