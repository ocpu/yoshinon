module.exports = class VoiceChannel {
       constructor(ch) {
           this._$ = ch
       }

       get id() {
           return this._$.id
       }

       get name() {
           return this._$.name
       }
 
       get position() {
           return this._$.position
       }
 
       get userLimit() {
           return this._$.user_limit
       }
}