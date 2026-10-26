/* Demo seed content, EN + ES twins: [en, es]. DRAFT pending native review.
   This is user-generated content in the real app (businesses and creators write their own); it's paired here only so the
   demo world reads naturally in ES. L.applySeedLang (data.js) flips a field only while it still holds the seed text. */
(function () {
  const L = window.L;
  L.SEED_ES = {
    // creators · bio
    cr1: { bio: ['Slow mornings, long lunches, the coast at golden hour. Marbella born.', 'Mañanas sin prisa, comidas largas, la costa a la hora dorada. Nacida en Marbella.'] },
    cr2: { bio: ['Skin, style and the odd sunset. Puerto Banús.', 'Piel, estilo y algún que otro atardecer. Puerto Banús.'] },
    cr3: { bio: ['Runner, swimmer, early riser. Estepona to the rock.', 'Corredor, nadador, madrugador. De Estepona al Peñón.'] },
    cr4: { bio: ['Where to eat with kids who have opinions.', 'Dónde comer con niños que tienen opinión propia.'] },
    cr5: { bio: ['After dark on the Costa. Rooftops, DJs, the good tables.', 'La Costa cuando cae la noche. Azoteas, DJs y las mejores mesas.'] },
    cr6: { bio: ['Moved from Madrid for the light. Beaches, coves and hidden calas.', 'Me vine de Madrid por la luz. Playas, rincones y calas escondidas.'] },
    cr7: { bio: ['Tapas, honest reviews, no filters on the croquetas.', 'Tapas, opiniones sinceras y croquetas sin filtros.'] },
    cr8: { bio: ['Menswear, Marbella, the occasional film camera.', 'Moda masculina, Marbella y alguna cámara analógica.'] },

    // businesses · description
    b1: { desc: ['Daybeds, grilled fish and the longest sunset on the Paseo. Open daily 10:00–late.', 'Camas balinesas, pescado a la brasa y el atardecer más largo del Paseo. Abierto todos los días de 10:00 hasta tarde.'] },
    b2: { desc: ['Andalusian tasting menus in the old town. Olive oil from our own grove.', 'Menús degustación andaluces en el casco antiguo. Aceite de nuestro propio olivar.'] },
    b3: { desc: ['Thermal circuit, sea-salt rituals and a quiet rooftop pool.', 'Circuito termal, rituales de sal marina y una piscina tranquila en la azotea.'] },
    b4: { desc: ['Rooftop bar over the marina. DJs Thursday to Sunday.', 'Bar en la azotea sobre el puerto deportivo. DJs de jueves a domingo.'] },
    b5: { desc: ['Beach bootcamps at sunrise, reformer pilates by night.', 'Bootcamps en la playa al amanecer y pilates reformer por la noche.'] },
    b6: { desc: ['Independent labels from Andalucía and Lisbon.', 'Marcas independientes de Andalucía y Lisboa.'] },
    b7: { desc: ['Brunch until four. Sourdough baked at dawn.', 'Brunch hasta las cuatro. Pan de masa madre horneado al amanecer.'] },

    // campaigns
    k1: { title: ['Sunset daybed reel', 'Reel al atardecer en cama balinesa'],
      brief: ['Capture the hour before sunset from one of our front-row daybeds: the light, the cava, the grilled fish coming out. Calm, warm, unhurried. No crowds in shot.', 'Capta la hora antes del atardecer desde una de nuestras camas balinesas en primera línea: la luz, el cava, el pescado a la brasa saliendo de cocina. Calma, calidez, sin prisa. Nada de multitudes en el plano.'],
      donts: ['No other venues or brands in shot.', 'Ningún otro local ni marca en el plano.'] },
    k12: { title: ['Sunrise swim & breakfast', 'Baño al amanecer y desayuno'],
      brief: ['A first swim off our jetty at seven, then breakfast on the terrace as the beach wakes up. Fresh, bright, quiet.', 'Un primer baño desde nuestro embarcadero a las siete y después desayuno en la terraza mientras la playa se despierta. Fresco, luminoso, tranquilo.'],
      donts: ['No other venues or brands in shot.', 'Ningún otro local ni marca en el plano.'] },
    k13: { title: ['Family Sunday on the sand', 'Domingo en familia en la arena'],
      brief: ['Lunch with the kids at a shaded front-row table: the paella, the sandcastles, the long table. Warm and real.', 'Comida con los niños en una mesa a la sombra en primera línea: la paella, los castillos de arena, la mesa larga. Cercano y real.'],
      donts: ['No other venues or brands in shot.', 'Ningún otro local ni marca en el plano.'] },
    k2: { title: ['Daybed for two', 'Cama balinesa para dos'], offer: ['Front-row daybed + lunch for two', 'Cama balinesa en primera línea + comida para dos'],
      brief: ['Spend an afternoon with us and show what a lazy Sunday on the Paseo feels like.', 'Pasa una tarde con nosotros y enseña cómo es un domingo tranquilo en el Paseo.'] },
    k3: { title: ['Autumn tasting menu', 'Menú degustación de otoño'],
      brief: ['Seven courses, one story. Film the kitchen pass and the first course reveal.', 'Siete platos, una historia. Graba el pase de cocina y la llegada del primer plato.'],
      donts: ['No flash photography in the dining room.', 'Nada de fotos con flash en el comedor.'] },
    k4: { title: ['Thermal circuit day', 'Día de circuito termal'], brief: ['A full circuit, from the salt room to the rooftop pool.', 'Un circuito completo, de la sala de sal a la piscina de la azotea.'] },
    k5: { title: ['Rooftop opening night', 'Inauguración en la azotea'],
      brief: ['Opening night of the new terrace. Arrive 21:00, capture the first set and the marina view.', 'Noche de inauguración de la nueva terraza. Llega a las 21:00 y graba el primer set y las vistas al puerto.'] },
    k6: { title: ['7am beach bootcamp', 'Bootcamp en la playa a las 7'], brief: ['Join a 45-minute session and show the burn and the sunrise.', 'Únete a una sesión de 45 minutos y enseña el esfuerzo y el amanecer.'] },
    k7: { title: ['AW26 styling session', 'Sesión de estilismo OI26'], offer: ['€150 store credit + styling hour', '€150 para gastar en tienda + una hora de estilismo'],
      brief: ['Pick three looks with our stylist and show the try-on.', 'Elige tres looks con nuestra estilista y enseña la prueba.'] },
    k8: { title: ['Brunch for two', 'Brunch para dos'], offer: ['Brunch for two + coffee', 'Brunch para dos + café'], brief: ['Weekend brunch on the plaza. Show the sourdough.', 'Brunch de fin de semana en la plaza. Enseña la masa madre.'] },
    k10: { title: ['Sunday paella session', 'Paella de domingo'],
      brief: ['Our chef cooks the Sunday paella over orange wood. Film the fire, the crust and the first spoonful.', 'Nuestro chef cocina la paella del domingo con leña de naranjo. Graba el fuego, el socarrat y la primera cucharada.'],
      donts: ['No flash in the dining room.', 'Nada de flash en el comedor.'] },
    k11: { title: ['Long lunch on the Paseo', 'Comida larga en el Paseo'],
      brief: ['Two hours at a front-row table: the grilled fish, a cold white, the Paseo going by. Warm, slow, real.', 'Dos horas en una mesa de primera línea: el pescado a la brasa, un blanco bien frío y el Paseo pasando. Cálido, sin prisa, de verdad.'],
      donts: ['No other venues or brands in shot.', 'Ningún otro local ni marca en el plano.'] },
    k9: { title: ['Summer closing party', 'Fiesta de cierre del verano'], brief: ['Last party of the season.', 'La última fiesta de la temporada.'] },

    // collabs · pitches and invite notes
    col4: { note: ['We loved your Café Sal reel. Would you film our autumn menu?', 'Nos encantó tu reel de Café Sal. ¿Te animas a grabar nuestro menú de otoño?'] },
    col5: { pitch: ['I swim at Estepona every morning, happy to do the 7am.', 'Nado en Estepona todas las mañanas, me apunto a la de las 7.'] },
    col6: { pitch: ['Sunday daybeds are my favourite story format. I can bring a photographer friend.', 'Las camas balinesas de domingo son mi formato de historia favorito. Puedo traer a una amiga fotógrafa.'] },
    col9: { pitch: ['Linen, sunset, a negroni. I know this brief.', 'Lino, atardecer y un negroni. Este briefing me lo sé.'] },
    col11: { pitch: ['Long lunches are my whole feed. I would love to film yours.', 'Las comidas largas son todo mi feed. Me encantaría grabar una aquí.'] },
    // col12: Lucía's application to Sunset daybed reel, created when C-12 is opened from the screen index
    col12: { pitch: ['Golden hour on the Paseo is my whole feed. I would love to film your daybeds.', 'La hora dorada en el Paseo es todo mi feed. Me encantaría grabar estas camas balinesas.'] },

    // drafts
    d1: { title: ['Winter terrace menu', 'Menú de invierno en la terraza'] },

    // chat threads · message index → [en, es]
    t1: { 1: ['Hi Mateo! Thursday at 19:30 works for the sunset slot?', '¡Hola, Mateo! ¿Te va bien el jueves a las 19:30 para el atardecer?'], 2: ['Perfect, see you Thursday.', 'Perfecto, nos vemos el jueves.'] },
    t2: { 1: ['Posted! The reel is up, screenshots attached.', '¡Publicado! El reel ya está subido, te adjunto capturas.'] },
    t3: { 1: ['Hola Lucía! Sunday 13:30 for the paella? The fire is lit by one.', '¡Hola, Lucía! ¿El domingo a las 13:30 para la paella? A la una ya está el fuego encendido.'], 2: ["Perfecto, I'll be there at 13:15.", 'Perfecto, estaré allí a las 13:15.'],
      5: ['We loved your Café Sal reel. Would you film our autumn menu?', 'Nos encantó tu reel de Café Sal. ¿Te animas a grabar nuestro menú de otoño?'] },
    t4: { 0: ['Thank you Lucía, the reel is beautiful.', 'Gracias, Lucía, el reel es precioso.'] },
    t6: { 1: ['Hola Lucía! Wednesday 13:30, front-row table? The fish comes off the grill at two.', '¡Hola, Lucía! ¿El miércoles a las 13:30, en una mesa de primera línea? El pescado sale de la brasa a las dos.'], 2: ['Perfect. See you Wednesday at 13:30.', 'Perfecto. Nos vemos el miércoles a las 13:30.'],
      5: ['Golden hour on the Paseo is my whole feed. I would love to film your daybeds.', 'La hora dorada en el Paseo es todo mi feed. Me encantaría grabar estas camas balinesas.'] }
  };
})();
