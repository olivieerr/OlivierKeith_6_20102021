const Sauce = require('../models/Sauce');
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    //delete req.body._id;
    const sauce = new Sauce({
        ...sauceObjet,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
        .catch(error => res.status(400).json({ error }))
};

exports.likeOrNotSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            let message;
            console.log("objet sauce dans like...", sauce)
            //si l'utilisateur aime la sauce
            if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes++;
                message = "L'utilisateur aime cette sauce";
            }

            //Si l'utilisateur n'aime pas la sauce
            if (req.body.like === -1 && !sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersDisliked.push((req.body.userId));
                sauce.dislikes++;
                message = "L'utilisateur n'aime pas cette sauce";
            }

            //l'utilisateur change son appreciation
            if(req.body.like === 0 ) {
                if(sauce.usersLiked.includes(req.body.userId)) {
                    sauce.usersLiked.pull(req.body.userId);
                    sauce.likes--;
                    message = "L'ulisateur a retiré sa mention \" j'aime \"";
                }
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    sauce.usersDisliked.pull(req.body.userId);
                    sauce.dislikes--;
                    message = "L'utilisateur a retiré sa mentien \" je n'aime pas\"";
                }
            }

            sauce.save()
                .then(() => res.status(200).json({message: message}))
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    if (req.file) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                        .then(() => res.status(200).json({message: 'Sauce modifiée'}))
                        .catch(error => res.status(400).json({error}));
                });
            })
            .catch(error => res.status(500).json({error}));
    } else {
        Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce modifiée'}))
            .catch(error => res.status(400).json({error}));
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id}, {...req.body, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée"}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};