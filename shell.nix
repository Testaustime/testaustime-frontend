{ pkgs ? import <nixpkgs> { } }:

let
in
pkgs.mkShell {
  # nativeBuildInputs is usually what you want -- tools you need to run
  nativeBuildInputs = [
    pkgs.nodejs-16_x
    pkgs.nodePackages.npm
  ];
}
