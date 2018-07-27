const chai = require('chai');
const expect = chai.expect
const sinon = require('sinon');
const path = require('path');
const scanner = require('../src/directory-scanner');

describe('Directory scanner', function() {
    it('should resolve path', function(done) {
        var resolvedPath = scanner.resolvePath('/etc/../etc');
        expect(resolvedPath).to.be.eq('/etc');
        done();
    });

    it('should resolve home path', function(done) {
        var resolvedPath = scanner.resolvePath("~/");
        expect(resolvedPath).to.be.eq(process.env.HOME + '/');
        done();
    });

    it('should fail scanning non-existent directory', function(done){
        var nonExistentPath = "/i-do-not-exist";

        var result = scanner.scan(nonExistentPath);

        result.then(function(asd) {
            done("Failed on test");
        }).catch(function (message) {
            expect(message).to.be.not.null;
            done();
        });
    });

    it('should scan directory', function(done) {
        var result = scanner.scan(__dirname);
        
        result.then(function(files) {
            expect(files).to.be.not.null;
            expect(files.length).to.be.gt(0);
            expect(files[0]).to.be.eq(__dirname);
            done();
        }).catch(function (message) {
            done(message);
        });

    });
});