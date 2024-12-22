/** Original */
exports.inviteUser = function (req, res) {
    var invitationBody = req.body; // Let's assume this body has been properly validated
    var shopId = req.params.shopId;
    var authUrl = "https://url.to.auth.system.com/invitation";
    superagent
        .post(authUrl)
        .send(invitationBody)
        .end(function (err, invitationResponse) {
            if (invitationResponse.status === 201) {
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
//

function onInvitationCreated(invitationResponse, invitationBody, shopId) {
    const authId = invitationResponse.body.authId;
    const invitationId = invitationResponse.body.invitationId;
    User.findOneAndUpdate(
        {
            authId,
        },
        {
            authId,
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
                if (shop.invitations.indexOf(invitationId)) {
                    shop.invitations.push(invitationId);
                }
                if (shop.users.indexOf(createdUser._id) === -1) {
                    shop.users.push(createdUser);
                }
                shop.save();
            });
        }
    );
}
exports.inviteUser = function (req, res) {
    var invitationBody = req.body; // Let's assume this body has been properly validated
    var shopId = req.params.shopId;
    var authUrl = "https://url.to.auth.system.com/invitation";
    superagent
        .post(authUrl)
        .send(invitationBody)
        .end(function (err, invitationResponse) {
            if (invitationResponse.status === 201) {
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
                res.status(400).json({
                    error: true,
                    message: "User already invited to this shop",
                });
                return;
            }
            res.json(invitationResponse);
        });
};